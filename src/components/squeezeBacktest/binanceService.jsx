import React from 'react';

export default class BinanceService { 
    
    constructor(ticker, interval, startTime = null, endTime = Date.now(), balance = 290, fees = 0.075) {
        this._apiBase = 'https://api.binance.com/api/v3/klines';
        this._apiBaseExchange = 'https://api.binance.com/api/v3/exchangeInfo';
        this.ticker = ticker;
        this.interval = interval;
        this.startTime = startTime;
        this.endTime = endTime;
        this.timeChange = 0;
        this.fees = fees / 100;
        this.balance = balance;
        this.binanceData = [];
        this.backtestData = [];
        this.tickersBlackList = [
            "BTCUSDT",
            "ETHUSDT",
            "BNBUSDT",
            "LINKUSDT",
            "LTCUSDT",
            "BUSDUSDT",
            "EURUSDT",
            "BTCUPUSDT",
            "BTCDOWNUSDT",
            "ETHUPUSDT",
            "ETHDOWNUSDT",
            "ADAUPUSDT",
            "ADADOWNUSDT",
            "LINKUPUSDT",
            "LINKDOWNUSDT",
            "BNBUPUSDT",
            "BNBDOWNUSDT",
            "TRXUPUSDT",
            "TRXDOWNUSDT",
            "XRPUPUSDT",
            "XRPDOWNUSDT",
            "DOTUPUSDT",
            "DOTDOWNUSDT",
            "TUSDUSDT",
        ];
        this.tickers = [];
    }

    getBinanceInfo = async () => {
        const res = await fetch(this._apiBaseExchange);
        
        if (!res.ok) {
            throw new Error(`Couldn't fetch ${this.ticker}` 
               `received: ${res.status}`);
        }

        return res.json();
    }

    // setTickers = async () => {
	// 	await this.getBinanceInfo().then(info => {
	// 		const symbols = info.symbols,
    //             tickers = [];

	// 		for (let item of symbols) {
	// 			if (item.quoteAsset === 'USDT' && item.status === "TRADING" && !this.tickersBlackList.includes(item.symbol)) {		
	// 				tickers.push(item.symbol);
	// 			}
	// 		}

    //         return tickers
	// 	}).then(tickers => {
    //         this.tickers = tickers
    //     })
	// }

    // getTickers = async () => {
    //     await this.setTickers()
    //     return this.tickers
    // }

    getData = async (startTime = this.startTime) => {
        const res = await fetch(`${this._apiBase}?symbol=${this.ticker}&interval=${this.interval}&startTime=${startTime}&limit=1000`);

        if (!res.ok) {
            throw new Error(`Couldn't fetch ${this.ticker}` 
               `received: ${res.status}`);
        }

        await res.json().then(data => {
            if (this.timeChange === 0) {
                this.timeChange = (data[data.length - 1][6] + 1) - data[0][0]
            }           
            this.binanceData.push(...data)
        });
    }

    getFullData = async () => {
        await this.getData()

        // console.log(this.timeChange)

        while (this.startTime < this.endTime) {
            this.startTime = this.startTime + this.timeChange
            await this.getData();
        }

        this.binanceData = [...new Set(this.binanceData.map(e => JSON.stringify(e)))].map(e => JSON.parse(e))
        this.binanceData.sort((a, b) => a[0] - b[0]);
    
        // console.log(`Binance data received: ${this.binanceData.length} bars`);
    }
    
    formatData(bind, buyPercent, sellPercent, stopPercent) {
        const buy = buyPercent / 100,
              sell = sellPercent / 100,
              stop= stopPercent / 100;

        this.backtestData = [];

        
        
        this.binanceData.forEach((data, i, arr) => { 
            if (i > 0) {
                       
                let bindValue;

                const prevItem = arr[i - 1];

                switch (bind.toLowerCase()) {
                    case 'o':
                        bindValue = +prevItem[1];
                        break;
                    case 'h':
                        bindValue = +prevItem[2];
                        break;
                    case 'l':
                        bindValue = +prevItem[3];
                        break;
                    case 'c':
                        bindValue = +prevItem[4];
                        break;
                    case 'hl':
                        bindValue = ((+prevItem[2] + +prevItem[3])/2);
                        break;
                    case 'oc':
                        bindValue = ((+prevItem[1] + +prevItem[4])/2);
                        break;
                    default: bindValue = ((+prevItem[1] + +prevItem[4])/2);
                }

                const buyLimitOrder = bindValue - bindValue * buy,
                      sellLimitOrder = buyLimitOrder * (1 + sell),
                      stopLimitOrder = buyLimitOrder - buyLimitOrder * stop;
                
                this.backtestData.push([
                    (new Date(data[0])).toLocaleString(),
                    ...data.slice(1, 6),
                    (new Date(data[6] + 1)).toLocaleString(),
                    Number(buyLimitOrder).toFixed(data[1].length - 2),
                    Number(sellLimitOrder).toFixed(data[1].length - 2),
                    Number(stopLimitOrder).toFixed(data[1].length - 2),
                ]);
                
            }
        })

        // console.log(this.backtestData);
    };

    getTrades = async (binds, configs, minimalTradesCount = 5, minimalPercentProfitableTrades = 70, minimalProfitPercent = 0) => {

        // console.log(`Getting trades for [${buyPercent.toFixed(1)}, ${sellPercent.toFixed(1)}, ${stopPercent.toFixed(1)}] config`);
        const tickerResults = [];

        for await (let bind of binds) {
            const bindResults = [];

            for (let config of configs) {
                const [buyPercent, sellPercent, stopPercent] = config
            
                this.formatData(bind, buyPercent, sellPercent, stopPercent);

                const data = this.backtestData;
    
                const trade = {
                    ticker: this.ticker,
                    interval: this.interval,
                    fees: this.fees,
                    initialBalance: this.balance,
                    baseBalance: this.balance,
                    buyPercent: Number(buyPercent).toFixed(2),
                    sellPercent: Number(sellPercent).toFixed(2),
                    stopPercent: Number(stopPercent).toFixed(2),
                    prevBaseBalance: 0,
                    tradeBalance: 0,
                    startDate: null,
                    openTime: null,
                    closeTime: null,
                    tradeIsOpen: false,
                    buyOrder: null,
                    sellOrder: null,
                    stopOrder: null,
                    barsToSell: 0,
                    maxBarsToSell: 0,
                    barsTotal: 0,
                    barsAvg: 0,
                    totalClosedTrades: 0,
                    totalStopped: 0,
                    totalProfitable: 0,
                    trades: [],
                    
                    tradeAmount(length) {
                        return +Number(this.tradeBalance).toFixed(length);
                    },
    
                    baseAmount() {
                        return Number(this.baseBalance).toFixed(2);
                    },
    
                    changeAmount() {
                        const res = Number(this.baseBalance - this.prevBaseBalance).toFixed(2);
                        return res >= 0 ? `+$${res}` : `-$${Math.abs(res)}`;                
                    },
    
                    totalEarned() {
                        const resAbsolute = Number(this.baseBalance - this.initialBalance).toFixed(2),
                            resRelative = Number(100 * (this.baseBalance / this.initialBalance) - 100).toFixed(2);
                        
                        return resAbsolute >= 0 ? `+$${resAbsolute} (+${resRelative}%)` : `-$${Math.abs(resAbsolute)} (${resRelative}%)`;
                    },
    
                    profitableTrades() {
                        return Number(100 * (this.totalProfitable / this.totalClosedTrades)).toFixed(2);
                    },
    
                    barsAvgAmount() {
                        return Math.round(this.barsTotal / this.totalClosedTrades);
                    },
    
                    openTrade(openTime, buy, sell, stop, bar) {
                        this.tradeIsOpen = true;
                        this.barsToSell = 0;
                        this.openTime = openTime;
                        this.buyOrder = buy;
                        this.sellOrder = sell;
                        this.stopOrder = stop;
                        this.prevBaseBalance = this.baseAmount();
                        this.tradeBalance = (this.baseBalance - (this.baseBalance * this.fees)) / this.buyOrder;
                        this.trades.push({
                            Time: this.openTime, 
                            Type: "BUY",
                            Price: this.buyOrder, 
                            Amount: this.tradeAmount(),
                            USD: this.baseAmount(),
                            Bar: bar             
                        });
                    },
    
                    closeTrade(openTime, bar) {
                        this.tradeIsOpen = false;
                        this.openTime = openTime;
                        this.baseBalance = (this.tradeBalance - (this.tradeBalance * this.fees)) * this.sellOrder;
                        this.totalClosedTrades++;
                        this.totalProfitable++;
                        if (this.barsToSell > this.maxBarsToSell) {
                            this.maxBarsToSell = this.barsToSell
                        }
                        this.trades.push({
                            Time: this.openTime,
                            Type: "SELL",
                            Price: this.sellOrder, 
                            Amount: this.tradeAmount(),
                            USD: this.baseAmount(), 
                            Change: this.changeAmount(),
                            Bars: this.barsToSell ? this.barsToSell : 'instant',
                            Bar: bar
                        })
                    },
    
                    stopTrade(openTime, bar) {
                        this.tradeIsOpen = false;
                        this.openTime = openTime;
                        this.baseBalance = (this.tradeBalance * this.stopOrder) - (this.tradeBalance * this.stopOrder) * this.fees;
                        this.totalClosedTrades++;
                        this.totalStopped++;
                        if (this.barsToSell > this.maxBarsToSell) {
                            this.maxBarsToSell = this.barsToSell
                        }
                        this.trades.push({
                            Time: this.openTime, 
                            Type: "STOP",
                            Price: this.stopOrder, 
                            Amount: this.tradeAmount(),
                            USD: this.baseAmount(), 
                            Change: this.changeAmount(),
                            Bars: this.barsToSell ? this.barsToSell : 'instant',
                            Bar: bar
                        })
                    },
    
                    continueTrade() {
                        this.barsToSell++;
                        this.barsTotal++;
                    },
                    
                    showStats() {
                        console.log(`[${this.buyPercent}, ${this.sellPercent}, ${this.stopPercent}] Total closed: ${this.totalClosedTrades}, Profitable: ${this.profitableTrades()}%, Total earned: ${this.totalEarned()}`);
                    },
                    
                    returnStats() {
                        return [
                            // this.startDate,
                            // this.ticker,
                            // this.interval,
                            this.buyPercent, 
                            this.sellPercent, 
                            this.stopPercent, 
                            this.totalClosedTrades, 
                            this.totalProfitable,
                            this.totalStopped,
                            this.profitableTrades(),
                            Number(this.baseBalance - this.initialBalance).toFixed(2),
                            Number(100 * (this.baseBalance / this.initialBalance) - 100).toFixed(2),
                            this.barsAvgAmount(),
                            this.maxBarsToSell,
                            this.trades
                        ];
                    }
                }
    
                data.forEach((bar, i) => {
                    const [openTime, , high, low, close, , , buy, sell, stop] = bar;
                    
                    if (i === 0) {
                        trade.startDate = openTime;
                    }
    
                    if (trade.tradeIsOpen) {
                        trade.continueTrade();
                        if (+low <= +trade.stopOrder) {
                            trade.stopTrade(openTime, bar);
                        } else if (+high >= +trade.sellOrder) {
                            trade.closeTrade(openTime, bar);
                        }
                    } else if (!trade.tradeIsOpen && +low <= +buy) {
                        trade.openTrade(openTime, buy, sell, stop, bar);
                        if (+low <= +trade.stopOrder) {
                            trade.stopTrade(openTime, bar);
                        } else if (+close >= +trade.sellOrder) {
                            trade.closeTrade(openTime, bar);
                        } 
                    }
                })
                
                // trade.showStats();
                const stats = trade.returnStats();   
                
                if (stats[3] <= minimalTradesCount) {
                    break
                }

                bindResults.push([this.ticker, this.interval, bind, ...stats])  
            }

            if (bindResults.length > 0) {
                const bindResultsSorted = bindResults.sort((a, b) => b[11] - a[11]);
                // console.log(bindResultsSorted);
                const bindResultsFiltered = bindResultsSorted.filter(result => result[9] > minimalPercentProfitableTrades && result[11] > minimalProfitPercent ? true : false);
                
                if (bindResultsFiltered.length > 0) {
                    bindResultsFiltered.forEach(item => tickerResults.push(item))
                    // console.log(`${ticker}, ${interval}, ${bind}:`)
                    // console.log(bindResultsFiltered);
                } else {
                    // console.log(`- ${this.ticker}, ${this.interval}, ${bind} don't have a good configs`)
                }
                
            } else {
                // console.log(`- ${this.ticker}, ${this.interval}, ${bind} not enough data`)
            }	
        }

        return tickerResults
    }
}