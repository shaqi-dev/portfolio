export default class BinanceService { 
    
    constructor(ticker, interval, startTime = null, endTime = Date.now(), balance = 280, fees = 0.075) {
        this._apiBaseBars = 'https://api.binance.com/api/v3/klines';
        this._apiBaseExchange = 'https://api.binance.com/api/v3/exchangeInfo';
        this._apiBase24H = 'https://api.binance.com/api/v3/ticker/24hr'
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
            "USDPUSDT",
            "SLPUSDT",
            "LOKAUSDT",
            "BTTUSDT"
        ];
    }

    

    getExchangeInfo = async () => {
        const res = await fetch(this._apiBaseExchange);
        
        if (!res.ok) {
            throw new Error(`Couldn't fetch ${this.ticker}` 
               `received: ${res.status}`);
        }

        return res.json();
    }

    getBars = async (startTime = this.startTime) => {
        const res = await fetch(`${this._apiBaseBars}?symbol=${this.ticker}&interval=${this.interval}&startTime=${startTime}&limit=1000`);

        if (!res.ok) {
            throw new Error(`Couldn't fetch ${this.ticker}` 
               `received: ${res.status}`);
        }

        await res.json().then(data => {
            if (this.timeChange === 0) {
                this.timeChange = (data[data.length - 1][6] + 1) - data[0][0]
            }

            data.forEach(item => item.splice(7))
            this.binanceData.push(...data)
        });
    }

    getBarsFullRange = async () => {
        await this.getBars()

        // console.log(this.timeChange)

        while (this.startTime < this.endTime) {
            this.startTime = this.startTime + this.timeChange
            await this.getBars();
        }
        
        this.binanceData = [...new Set(this.binanceData.map(e => JSON.stringify(e)))].map(e => JSON.parse(e))
        this.binanceData.sort((a, b) => a[0] - b[0]);

        return this.binanceData    
        // console.log(`Binance data received: ${this.binanceData.length} bars`);
    }

    getVolume24H = async (ticker) => {
        const res = await fetch(`${this._apiBase24H}?symbol=${ticker}`);

        if (!res.ok) {
            throw new Error(`Couldn't fetch ${ticker}` 
               `received: ${res.status}`);
        }

        return res.json().then(res => res.quoteVolume)
    }

    getSymbols = async () => {
		const info = await this.getExchangeInfo()
    
        return info.symbols
	}

    getTickers = async (quoteAsset) => {
        const allSymbols = await this.getSymbols()

        const tickers = [];
        
        allSymbols.forEach(item => {
            if (item.quoteAsset === quoteAsset 
                && item.status === 'TRADING' 
                && !this.tickersBlackList.includes(item.symbol)) {
                tickers.push(item.symbol)
            }
        })

        const tickersSorted = tickers.sort()

        return tickersSorted
    }

    filterTickersByVolume = async (tickers, minimalVolume) => {
        const tickersFiltered = [];
        
        console.log(`Filtering tickers by minmal volume...`)
        console.time('Tickers filtering: ')
        for await (let ticker of tickers) {
            const volume = await this.getVolume24H(ticker);
            
            if (volume / 1000000 > minimalVolume) {
                tickersFiltered.push(ticker)
            }
        }
        
        console.log(`Filtering result: ${tickersFiltered.length} tickers`)
        console.timeEnd('Tickers filtering: ')
        return tickersFiltered
    }  

    getTrades = async (binds, configs, minimalTradesCount = 5, maxBarsToSell = 5, minimalPercentProfitableTrades = 70, minimalProfitPercent = 0, maximalDrawdown = -5) => {

        // console.log(`Getting trades for [${buyPercent.toFixed(1)}, ${sellPercent.toFixed(1)}, ${stopPercent.toFixed(1)}] config`);
        const data = await this.getBarsFullRange(),
              tickerResults = [];
        
        for await (let bind of binds) {
            const bindResults = [];

            for (let config of configs) {
                const [buyPercent, sellPercent, stopPercent] = config
                
                // Trade Object
                const trade = {
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
                    currentDrawdawn: 0,
                    maxDrawdawn: 0,
                    trades: [],
                    
                    tradeAmount(length) {
                        return +Number(this.tradeBalance).toFixed(length);
                    },
    
                    baseAmount() {
                        return Number(this.baseBalance).toFixed(2);
                    },
    
                    changeAmount() {
                        const res = Number(this.baseBalance - this.prevBaseBalance).toFixed(2);
                        return +res          
                    },

                    changePercent() {
                        const res = Number(100 * (this.baseBalance / this.prevBaseBalance - 1)).toFixed(2);
                        return +res          
                    },
    
                    totalEarned() {
                        const resAbsolute = Number(this.baseBalance - this.initialBalance).toFixed(2),
                            resRelative = Number(100 * (this.baseBalance / this.initialBalance - 1)).toFixed(2);
                        
                        return resAbsolute >= 0 ? `+$${resAbsolute} (+${resRelative}%)` : `-$${Math.abs(resAbsolute)} (${resRelative}%)`;
                    },
    
                    percentProfitable() {
                        return Number(100 * (this.totalProfitable / this.totalClosedTrades)).toFixed(2);
                    },
    
                    barsAvgAmount() {
                        return Math.round(this.barsTotal / this.totalClosedTrades);
                    },
    
                    openTrade(openTime, buy, sell, stop, bar) {
                        this.tradeIsOpen = true;
                        this.barsToSell = 0;
                        this.openTime = (new Date(openTime)).toLocaleString();
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
                        this.openTime = (new Date(openTime)).toLocaleString();
                        this.baseBalance = (this.tradeBalance - (this.tradeBalance * this.fees)) * this.sellOrder;
                        this.totalClosedTrades++;
                        this.totalProfitable++;
                        
                        if (this.currentDrawdawn < 0 && (this.currentDrawdawn + this.changePercent()) < 0) {
                            this.currentDrawdawn += this.changePercent();
                        } else if (this.currentDrawdawn < 0 && (this.currentDrawdawn + this.changePercent()) >= 0) {
                            this.currentDrawdawn = 0
                        }

                        if (this.barsToSell > this.maxBarsToSell) {
                            this.maxBarsToSell = this.barsToSell
                        }

                        this.trades.push({
                            Time: this.openTime,
                            Type: "SELL",
                            Price: this.sellOrder, 
                            Amount: this.tradeAmount(),
                            USD: this.baseAmount(), 
                            'Change, $': this.changeAmount(),
                            'Change, %': this.changePercent(),
                            'Current Drawdown, %': this.currentDrawdawn,
                            Bars: this.barsToSell ? this.barsToSell : 'instant',
                            Bar: bar
                        })
                    },
    
                    stopTrade(openTime, bar) {
                        this.tradeIsOpen = false;
                        this.openTime = (new Date(openTime)).toLocaleString();
                        this.baseBalance = (this.tradeBalance * this.stopOrder) - (this.tradeBalance * this.stopOrder) * this.fees;
                        this.totalClosedTrades++;
                        this.totalStopped++;
                        this.currentDrawdawn += this.changePercent();
                       
                        if (this.currentDrawdawn < this.maxDrawdawn) {
                            this.maxDrawdawn = this.currentDrawdawn
                        }
                        
                        if (this.barsToSell > this.maxBarsToSell) {
                            this.maxBarsToSell = this.barsToSell
                        }
                        
                        this.trades.push({
                            Time: this.openTime, 
                            Type: "STOP",
                            Price: this.stopOrder, 
                            Amount: this.tradeAmount(),
                            USD: this.baseAmount(), 
                            'Change, $': this.changeAmount(),
                            'Change, %': this.changePercent(),
                            'Current Drawdown, %': this.currentDrawdawn,
                            Bars: this.barsToSell ? this.barsToSell : 'instant',
                            Bar: bar
                        })

                    },
    
                    continueTrade() {
                        this.barsToSell++;
                        this.barsTotal++;
                    },
                    
                    returnStats() {
                        return [
                            this.buyPercent, 
                            this.sellPercent, 
                            this.stopPercent, 
                            this.totalClosedTrades, 
                            this.totalProfitable,
                            this.totalStopped,
                            this.percentProfitable(),
                            Number(this.baseBalance - this.initialBalance).toFixed(2),
                            Number(100 * (this.baseBalance / this.initialBalance) - 100).toFixed(2),
                            Number(this.maxDrawdawn).toFixed(2),
                            this.barsAvgAmount(),
                            this.maxBarsToSell,
                            this.trades
                        ];
                    }
                }
                
                // Config Backtest
                data.forEach((bar, i, arr) => {
                    const [openTime, , high, low, close] = bar;

                    // Starting from second bar
                    if (i > 0) {
                        const prevBar = arr[i - 1];

                        // Getting bind value
                        let bindValue;

                        switch (bind.toLowerCase()) {
                            case 'o':
                                bindValue = +prevBar[1];
                                break;
                            case 'h':
                                bindValue = +prevBar[2];
                                break;
                            case 'l':
                                bindValue = +prevBar[3];
                                break;
                            case 'c':
                                bindValue = +prevBar[4];
                                break;
                            case 'hl':
                                bindValue = ((+prevBar[2] + +prevBar[3])/2);
                                break;
                            case 'oc':
                                bindValue = ((+prevBar[1] + +prevBar[4])/2);
                                break;
                            default: bindValue = ((+prevBar[1] + +prevBar[4])/2);
                        }
        
                        const buy = bindValue - bindValue * (buyPercent / 100),
                                sell = buy * (1 + (sellPercent / 100)),
                                stop = buy - buy * (stopPercent / 100);

                        const modifiedBar = (bar) => {
                            return [                
                                (new Date(bar[0])).toLocaleString(),
                                ...bar.slice(1, 6),
                                (new Date(bar[6] + 1)).toLocaleString(),
                                Number(buy).toFixed(bar[1].length - 2),
                                Number(sell).toFixed(bar[1].length - 2),
                                Number(stop).toFixed(bar[1].length - 2),
                            ]
                        }
                        
                        // Setting trade open time
                        if (i === 0) {
                            trade.startDate = openTime;
                        }
        
                        // Main strategy logic
                        if (trade.tradeIsOpen) {
                            trade.continueTrade();
                            if (+low <= +trade.stopOrder) {
                                trade.stopTrade(openTime, modifiedBar(bar));
                            } else if (+high >= +trade.sellOrder) {
                                trade.closeTrade(openTime, modifiedBar(bar));
                            }
                        } else if (!trade.tradeIsOpen && +low <= +buy) {
                            trade.openTrade(openTime, buy, sell, stop, modifiedBar(bar));
                            if (+low <= +trade.stopOrder) {
                                trade.stopTrade(openTime, modifiedBar(bar));
                            } else if (+close >= +trade.sellOrder) {
                                trade.closeTrade(openTime, modifiedBar(bar));
                            } 
                        }
                    }  
                })
                
                // Stop backtesting when not enough data
                const stats = trade.returnStats();   

                if (stats[3] < minimalTradesCount) {
                    break
                }

                //Filtering trades
                if (stats[11] > maxBarsToSell
                    || stats[6] < minimalPercentProfitableTrades 
                    || stats[8] < minimalProfitPercent
                    || stats[9] < maximalDrawdown) {
                    continue
                }
                
                const rate = +Number(
                    stats[0] * 0.2 
                    + (stats[1] / stats[2]) * 0.2 
                    + stats[3] * 0.05 
                    + stats[4] * 0.05 
                    - stats[5] * 0.1 
                    + stats[6] * 0.01 
                    + stats[8] * 0.2
                    + stats[9] * 0.5 
                    - (stats[10] > 1 ? stats[10] * 0.1 : 0)
                    - stats[11] * 0.01
                    ).toFixed(2)

                // Push current config results
                bindResults.push([this.ticker, this.interval, bind, ...stats, rate])
            }

            // Sort and push current bind results
            if (bindResults.length > 0) {
                const bindResultsSorted = bindResults.sort((a, b) => b[16] - a[16]);            
                if (bindResultsSorted.length > 0) {
                    bindResultsSorted.forEach(item => tickerResults.push(item))
                }     
            }
        }

        // Sort and return best ticker results
        if (tickerResults.length > 0) {
            const tickerResultsSorted = tickerResults.sort((a, b) => b[16] - a[16]);
            const best = tickerResultsSorted[0];        	
            return best
        }
    }
}