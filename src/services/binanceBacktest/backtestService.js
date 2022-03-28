import getLexxService from "./getLexxService";
import BinanceService from "./binanceService";
import createOptions from "./createOptions";

async function backtestService(customTickers, settings, binds, minimalVolume = 20, minimalTradesCount, minimalPercentProfitableTrades, minimalProfitPercent, maximalDrawdown) {

    const binance = new BinanceService();
    const allUsdtTickers = await binance.getTickers('USDT');
    const tickersFilteredByVolume = await binance.filterTickersByVolume(customTickers ? customTickers : allUsdtTickers, minimalVolume)

    const totalResults = [];
    
    console.log(`# # # Backtest starts # # #`)
    console.time('Total finished in:')

    for await (let setting of settings) {
        const [ interval, timeStart, configsName, maxBarsToSell ] = setting

        let start;

        switch (timeStart) {
            case 'last12h':
                start = Date.now() - 1000 * 60 * 60 * 12;
                break
            case 'last24h':
                start = Date.now() - 1000 * 60 * 60 * 24;
                break
            case 'last48h':
                start = Date.now() - 1000 * 60 * 60 * 24 * 2;
                break
            case 'last72h':
                start = Date.now() - 1000 * 60 * 60 * 24 * 3;
                break
            case 'last1w':
                start = Date.now() - 1000 * 60 * 60 * 24 * 7;
                break
            case 'last2w':
                start = Date.now() - 1000 * 60 * 60 * 24 * 7 * 2;
                break
            case 'last4w':
                start = Date.now() - 1000 * 60 * 60 * 24 * 7 * 4;
                break
            default: start = Date.now() - 1000 * 60 * 60 * 24;
        }

        let configs;

        switch (configsName) {
            case 'configsHR':
                configs = createOptions(
                    [1.0, 4.0, 0.1],
                    [0.8, 4.0, 0.1],
                    [0.8, 4.0, 0.1],
                    0.8,
                    0.8
                );
                break
            case 'configsMR':
                configs = createOptions(
                    [3.0, 8.0, 0.2],
                    [1.0, 8.0, 0.2],
                    [1.0, 8.0, 0.2],
                    0.8,
                    0.8
                );
                break
            default: configs = createOptions(
                [3.0, 8.0, 0.2],
                [1.0, 8.0, 0.2],
                [1.0, 8.0, 0.2],
                0.8,
                0.8
            );
        }

        const intervalResults = [];

        // Current interval backtest
        for await (let ticker of tickersFilteredByVolume) {
            console.time(`${ticker} finished in:`)
            const binance = new BinanceService(ticker, interval, start);	
            await binance.getBarsFullRange();			
            const tickerBestResult = await binance.getTrades(binds, configs, minimalTradesCount, maxBarsToSell, minimalPercentProfitableTrades, minimalProfitPercent, maximalDrawdown);	
            intervalResults.push(tickerBestResult)
            console.timeEnd(`${ticker} finished in:`)
        };							

        // Filter and push current interval results
        if (intervalResults.length > 0) {
            const intervalResultsSorted = intervalResults.sort((a, b) => b[16] - a[16])
            totalResults.push(...intervalResultsSorted)
            console.log(`- - - Best ${interval} configs - - -`)
            intervalResultsSorted.slice(0, 20).forEach(async res => {
                console.log(res)
                console.log(getLexxService(res));
            })
        } else {
            console.log(`- - - ${interval} don't have a good configs - - -`)
        }
    }
    
    console.log(`# # # Backtest finished # # #`)
    console.timeEnd('Total finished in:')

    if (settings.length > 1 && totalResults.length > 0) {
        const totalResultsSorted = totalResults.sort((a, b) => b[16] - a[16])

        console.log(`- - - Total results - - -`)
        console.log(totalResultsSorted);
        console.log(`- - - Best configs - - -`)
        totalResultsSorted.slice(0, 50).forEach(res => {
            console.log(res)
            console.log(getLexxService(res));
        })
    }
}

export default backtestService;