import './app.css';
import React from 'react';
import PdClock from '../pdClock';
import Hero from '../hero';
import BinanceService from '../squeezeBacktest';
import { SecondaryButton } from '../ui-elements/buttons';

function App() {

	function createOptions(buyRange, sellRange, stopRange, maxSellRate = 0.5, maxStopRate = 2) {

		const range = (start, end, step) => Array.from({length: ((end - start) / step) + 1}, (v, k) => Math.round((k * step + start) * 10) / 10);

		const buyArr = range(...buyRange),
			  sellArr = range(...sellRange),
			  stopArr = range(...stopRange),
			  resArr = [buyArr, sellArr, stopArr],
			  options = [];

		resArr[0].forEach((buy) => {
			resArr[1].forEach((sell) => {
				resArr[2].forEach((stop) => {
					if (sell * maxStopRate >= stop && buy * maxSellRate >= sell) {
						options.push([buy, sell, stop]);
					}
				});
			});
		});
		return options;
	};

	// const tickersBlackList = [
	// 	"BTCUSDT",
	// 	"ETHUSDT",
	// 	"BNBUSDT",
	// 	"LINKUSDT",
	// 	"LTCUSDT",
	// 	"BUSDUSDT",
	// 	"EURUSDT",
	// 	"BTCUPUSDT",
	// 	"BTCDOWNUSDT",
	// 	"ETHUPUSDT",
	// 	"ETHDOWNUSDT",
	// 	"ADAUPUSDT",
	// 	"ADADOWNUSDT",
	// 	"LINKUPUSDT",
	// 	"LINKDOWNUSDT",
	// 	"BNBUPUSDT",
	// 	"BNBDOWNUSDT",
	// 	"TRXUPUSDT",
	// 	"TRXDOWNUSDT",
	// 	"XRPUPUSDT",
	// 	"XRPDOWNUSDT",
	// 	"DOTUPUSDT",
	// 	"DOTDOWNUSDT",
	// 	"TUSDUSDT",
	//	"USDPUSDT",
	// ]

	
	// function getTickers() {
	// 	const res = new BinanceService();

	// 		res.getBinanceInfo().then(info => {
	// 		const symbols = info.symbols;
			
	// 		// console.log(symbols)

	// 		for (let item of symbols) {
	// 			if (item.quoteAsset === 'USDT' && item.status === "TRADING" && !tickersBlackList.includes(item.symbol)) {		
	// 				tickers.push(item.symbol);
	// 			}
	// 		}
	// 	})
	// };

	// getTickers();

	// console.log(tickers);

	const configsUltimateHR = createOptions(
		[1.0, 4.0, 0.1], 
		[0.5, 8.0, 0.1], 
		[0.5, 8.0, 0.1],
		2.0,
		0.7,
	);

	const configsUltimateMR = createOptions(
		[3.0, 8.0, 0.2], 
		[1.0, 8.0, 0.2], 
		[0.6, 8.0, 0.2],
		2.0,
		0.7,
	);
	
	console.log(`Ultimate High Risk has: ${configsUltimateHR.length} configs`);
	console.log(`Ultimate Medium Risk has: ${configsUltimateMR.length} configs`);

	const range24H = Date.now() - 86400000,
		  range48H = Date.now() - 172800000,
		  range72H = Date.now() - 259200000,
		  range1W = Date.now() - 604800000,
		  range2W = Date.now() - 1209600000;

	const tickersTest = [
		'GMTUSDT',
	]

	const tickersUltimate = [
		'JASMYUSDT',
	]

	const tickersUSDT = [
		// "NEOUSDT",
		// "QTUMUSDT",
		// "ADAUSDT",
		// "XRPUSDT",
		// "EOSUSDT",
		// "IOTAUSDT",
		// "XLMUSDT",
		// "ONTUSDT",
		// "TRXUSDT",
		// "ETCUSDT",
		// "ICXUSDT",
		// "NULSUSDT",
		// "VETUSDT",
		// "USDCUSDT",
		// "WAVESUSDT",
		// "ONGUSDT",
		// "HOTUSDT",
		// "ZILUSDT",
		// "ZRXUSDT",
		// "FETUSDT",
		// "BATUSDT",
		// "XMRUSDT",
		// "ZECUSDT",
		// "IOSTUSDT",
		// "CELRUSDT",
		// "DASHUSDT",
		// "OMGUSDT",
		// "THETAUSDT",
		// "ENJUSDT",
		"MITHUSDT",
		// "MATICUSDT",
		// "ATOMUSDT",
		// "TFUELUSDT",
		// "ONEUSDT",
		// "FTMUSDT",
		// "ALGOUSDT",
		// "GTOUSDT",
		// "DOGEUSDT",
		// "DUSKUSDT",
		// "ANKRUSDT",
		// "WINUSDT",
		"COSUSDT",
		"COCOSUSDT",
		// "MTLUSDT",
		// "TOMOUSDT",
		"PERLUSDT",
		// "DENTUSDT",
		"MFTUSDT",
		"KEYUSDT",
		// "DOCKUSDT",
		"WANUSDT",
		// "FUNUSDT",
		// "CVCUSDT",
		// "CHZUSDT",
		// "BANDUSDT",
		// "BEAMUSDT",
		// "XTZUSDT",
		// "RENUSDT",
		// "RVNUSDT",
		// "HBARUSDT",
		// "NKNUSDT",
		// "STXUSDT",
		// "KAVAUSDT",
		// "ARPAUSDT",
		// "IOTXUSDT",
		// "RLCUSDT",
		"CTXCUSDT",
		// "BCHUSDT",
		"TROYUSDT",
		// "VITEUSDT",
		// "FTTUSDT",
		"OGNUSDT",
		// "DREPUSDT",
		// "TCTUSDT",
		// "WRXUSDT",
		// "BTSUSDT",
		// "LSKUSDT",
		// "BNTUSDT",
		// "LTOUSDT",
		// "AIONUSDT",
		"MBLUSDT",
		// "COTIUSDT",
		// "STPTUSDT",
		// "WTCUSDT",
		// "DATAUSDT",
		// "SOLUSDT",
		// "CTSIUSDT",
		// "HIVEUSDT",
		// "CHRUSDT",
		// "GXSUSDT",
		// "ARDRUSDT",
		// "MDTUSDT",
		// "STMXUSDT",
		// "KNCUSDT",
		// "REPUSDT",
		// "LRCUSDT",
		// "PNTUSDT",
		// "COMPUSDT",
		// "SCUSDT",
		// "ZENUSDT",
		// "SNXUSDT",
		// "VTHOUSDT",
		// "DGBUSDT",
		// "GBPUSDT",
		// "SXPUSDT",
		// "MKRUSDT",
		// "DCRUSDT",
		// "STORJUSDT",
		// "MANAUSDT",
		// "AUDUSDT",
		// "YFIUSDT",
		// "BALUSDT",
		// "BLZUSDT",
		// "IRISUSDT",
		// "KMDUSDT",
		// "JSTUSDT",
		// "SRMUSDT",
		// "ANTUSDT",
		// "CRVUSDT",
		// "SANDUSDT",
		// "OCEANUSDT",
		// "NMRUSDT",
		// "DOTUSDT",
		// "LUNAUSDT",
		// "RSRUSDT",
		// "PAXGUSDT",
		// "WNXMUSDT",
		// "TRBUSDT",
		// "SUSHIUSDT",
		// "YFIIUSDT",
		// "KSMUSDT",
		// "EGLDUSDT",
		// "DIAUSDT",
		"RUNEUSDT",
		// "FIOUSDT",
		// "UMAUSDT",
		// "BELUSDT",
		// "WINGUSDT",
		// "UNIUSDT",
		// "NBSUSDT",
		"OXTUSDT",
		// "SUNUSDT",
		// "AVAXUSDT",
		// "HNTUSDT",
		// "FLMUSDT",
		// "ORNUSDT",
		// "UTKUSDT",
		// "XVSUSDT",
		// "ALPHAUSDT",
		// "AAVEUSDT",
		// "NEARUSDT",
		// "FILUSDT",
		"INJUSDT",
		// "AUDIOUSDT",
		// "CTKUSDT",
		// "AKROUSDT",
		// "AXSUSDT",
		// "HARDUSDT",
		// "DNTUSDT",
		// "STRAXUSDT",
		// "UNFIUSDT",
		// "ROSEUSDT",
		// "AVAUSDT",
		// "XEMUSDT",
		// "SKLUSDT",
		// "SUSDUSDT",
		// "GRTUSDT",
		// "JUVUSDT",
		// "PSGUSDT",
		// "1INCHUSDT",
		// "REEFUSDT",
		// "OGUSDT",
		// "ATMUSDT",
		// "ASRUSDT",
		// "CELOUSDT",
		// "RIFUSDT",
		// "BTCSTUSDT",
		// "TRUUSDT",
		// "CKBUSDT",
		// "TWTUSDT",
		// "FIROUSDT",
		// "LITUSDT",
		// "SFPUSDT",
		// "DODOUSDT",
		// "CAKEUSDT",
		// "ACMUSDT",
		// "BADGERUSDT",
		// "FISUSDT",
		// "OMUSDT",
		// "PONDUSDT",
		// "DEGOUSDT",
		// "ALICEUSDT",
		// "LINAUSDT",
		// "PERPUSDT",
		// "RAMPUSDT",
		// "SUPERUSDT",
		// "CFXUSDT",
		// "EPSUSDT",
		// "AUTOUSDT",
		// "TKOUSDT",
		// "PUNDIXUSDT",
		// "TLMUSDT",
		// "BTGUSDT",
		// "MIRUSDT",
		// "BARUSDT",
		// "FORTHUSDT",
		// "BAKEUSDT",
		// "BURGERUSDT",
		"SLPUSDT",
		// "SHIBUSDT",
		// "ICPUSDT",
		// "ARUSDT",
		// "POLSUSDT",
		"MDXUSDT",
		// "MASKUSDT",
		// "LPTUSDT",
		// "XVGUSDT",
		// "ATAUSDT",
		// "GTCUSDT",
		// "TORNUSDT",
		// "ERNUSDT",
		// "KLAYUSDT",
		// "PHAUSDT",
		// "BONDUSDT",
		// "MLNUSDT",
		// "DEXEUSDT",
		// "C98USDT",
		// "CLVUSDT",
		// "QNTUSDT",
		// "FLOWUSDT",
		// "TVKUSDT",
		// "MINAUSDT",
		// "RAYUSDT",
		// "FARMUSDT",
		// "ALPACAUSDT",
		// "QUICKUSDT",
		// "MBOXUSDT",
		// "FORUSDT",
		"REQUSDT",
		// "GHSTUSDT",
		// "WAXPUSDT",
		// "TRIBEUSDT",
		// "GNOUSDT",
		// "XECUSDT",
		// "ELFUSDT",
		// "DYDXUSDT",
		// "POLYUSDT",
		"IDEXUSDT",
		// "VIDTUSDT",
		// "GALAUSDT",
		// "ILVUSDT",
		// "YGGUSDT",
		// "SYSUSDT",
		// "DFUSDT",
		// "FIDAUSDT",
		// "FRONTUSDT",
		// "CVPUSDT",
		// "AGLDUSDT",
		// "RADUSDT",
		// "BETAUSDT",
		// "RAREUSDT",
		"LAZIOUSDT",
		// "CHESSUSDT",
		// "ADXUSDT",
		// "AUCTIONUSDT",
		// "DARUSDT",
		// "BNXUSDT",
		// "MOVRUSDT",
		// "CITYUSDT",
		// "ENSUSDT",
		"KP3RUSDT",
		// "QIUSDT",
		// "PORTOUSDT",
		// "POWRUSDT",
		// "VGXUSDT",
		"JASMYUSDT",
		// "AMPUSDT",
		// "PLAUSDT",
		// "PYRUSDT",
		// "RNDRUSDT",
		// "ALCXUSDT",
		"SANTOSUSDT",
		// "MCUSDT",
		// "ANYUSDT",
		// "BICOUSDT",
		// "FLUXUSDT",
		// "FXSUSDT",
		"VOXELUSDT",
		// "HIGHUSDT",
		// "CVXUSDT",
		// "PEOPLEUSDT",
		// "OOKIUSDT",
		"SPELLUSDT",
		// "USTUSDT",
		// "JOEUSDT",
		// "ACHUSDT",
		// "IMXUSDT",
		// "GLMRUSDT",
		// "LOKAUSDT",
		// "SCRTUSDT",
		// "API3USDT",
		// "BTTCUSDT",
		"ACAUSDT",
		// "ANCUSDT",
		// "XNOUSDT",
		// "WOOUSDT",
		"ALPINEUSDT",
		"TUSDT",
		// "ASTRUSDT",
		// "NBTUSDT",
		"GMTUSDT",
		// "KDAUSDT"
	]

	const tickersUSDT24H = [
		'GMTUSDT',
		// 'SYSUSDT',
		'JASMYUSDT',
		// 'XNOUSDT',
		// 'CELOUSDT',
		// 'OGUSDT',
		// 'WOOUSDT',
		// 'AGLDUSDT',
		// 'SANTOSUSDT',
		// 'GLMRUSDT',
		// 'LAZIOUSDT',
		// 'SANDUSDT',
		// 'AAVEUSDT',
		// 'LINAUSDT',
		// 'ADXUSDT',
		// 'RSRUSDT',
		// 'PORTOUSDT',
		// 'MINAUSDT',
		// 'ARUSDT',
		// 'PEOPLEUSDT',
		// 'VITEUSDT',
		// 'OGNUSDT',
		// 'CVPUSDT',
		// 'POLSUSDT',
		// 'MIRUSDT',
		// 'ALPINEUSDT',
		// 'RUNEUSDT',
		// 'DUSKUSDT',
		// 'ANCUSDT',
		// 'JOEUSDT',
		// 'VOXELUSDT',
		// 'CAKEUSDT',
		// 'SNXUSDT',
		// 'SLPUSDT',
		// 'KEYUSDT',
		// 'SPELLUSDT',
		// 'MBOXUSDT',
		// 'WANUSDT',
		// 'REQUSDT',
		// 'TROYUSDT',
		// 'IDEXUSDT',
		// 'QIUSDT',
		// 'MFTUSDT',
		// 'MBLUSDT',
		// 'UMAUSDT',
		// 'COCOSUSDT',
		// 'ACAUSDT',
		// 'IRISUSDT',
		// 'BETAUSDT',
		// 'OXTUSDT',
		// 'MOVRUSDT',
		// 'FORUSDT',
		// 'NBSUSDT',
	]

	const USDT1MUltimate24H = [tickersUSDT24H, ['1m'], ['O', 'H', 'L', 'C', 'HL', 'OC'], configsUltimateHR, range24H];

	const backtestService = async (tickers, intervals, binds, configs, timeStart) => {

		const totalResults = [];
		
		console.log(`# # # Backtest starts # # #`)
		console.time('Total finished in:')

		for await (let interval of intervals) {
			// console.log(`~ ~ ~ Backtest starts ${interval} ~ ~ ~`)

			const intervalResults = [];

			for await (let ticker of [...new Set(tickers)]) {			
				console.time(`${ticker} finished in:`)
				
				const res = new BinanceService(ticker, interval, timeStart);
				await res.getFullData();			
				
				const tickerResults = await res.getTrades(binds, configs, 5, 80);

				if (tickerResults.length > 0) {
					const tickerResultsSorted = tickerResults.sort((a, b) => b[11] - a[11]);
					const best = tickerResultsSorted[0];
					intervalResults.push(best);
					
					// console.log(`- - - Total ${ticker}, ${interval} - - - `);
					// console.log(tickerResultsSorted)

					console.log(`- - - Best ${ticker}, ${interval} - - -`);
					console.log(best);
					console.log(getLEXX(best));

					// console.log(`Total results updated:`);
					// const intervalResultsSorted = intervalResults.sort((a, b) => b[11] - a[11])
					// console.log(intervalResultsSorted);			
				} else {
					console.log(`- - - ${ticker}, ${interval} don't have a good configs - - -`)
				}

				console.timeEnd(`${ticker} finished in:`)
			};							

			// console.log(`~ ~ ~ Backtest finished ${interval} ~ ~ ~`)
			if (intervalResults.length > 0) {
				const intervalResultsSorted = intervalResults.sort((a, b) => b[11] - a[11])
				totalResults.push(...intervalResultsSorted)

				// console.log(`Total results:`)
				// console.log(intervalResultsSorted);
				console.log(`- - - Best ${interval} configs - - -`)
				intervalResultsSorted.slice(0, 20).forEach(res => {
					console.log(res)
					console.log(getLEXX(res));
				})
			} else {
				console.log(`- - - ${interval} don't have a good configs - - -`)
			}
		}
		
		console.log(`# # # Backtest finished # # #`)
		console.timeEnd('Total finished in:')

		if (intervals.length > 1 && totalResults.length > 0) {
			const totalResultsSorted = totalResults.sort((a, b) => b[11] - a[11])

			console.log(`- - - Total results - - -`)
			console.log(totalResultsSorted);
			console.log(`- - - Best configs - - -`)
			totalResultsSorted.slice(0, 20).forEach(res => {
				console.log(res)
				console.log(getLEXX(res));
			})
		} else {
			console.log(`- - - Total don't have a good configs - - -`)
		}
	}

	function getLEXX(stats) {
		return `https://lexxtg.com/bot#t=s&s=binance:${stats[0]}&tf=${stats[1]}&bi=${stats[2].toLowerCase()}&bt=${stats[3]}&st=${stats[4]}&sl=${stats[5]}&tc=r&as=1&tu=1&oc=1&stt=${stats[3] > 2 ? (stats[3] - 1).toFixed(2) : 1}&slc=0&slcp=0`
	}

	// const tickers = async () => {
	// 	const res = new BinanceService();
	// 	const data = await res.getTickers();

	// 	return data;
	// }
	
	return (
		<>
			<div className="container">
				<div className="section hero-section">
					<Hero />
				</div>
				<div className="section about-section">
					<h3 className="section-title">
						<span className="primary-color">01. </span>Binance Squeeze Backtest
					</h3>
					<SecondaryButton
							type="button"
							className="time-settings__button"
							onClick={ () => {								
								backtestService(...USDT1MUltimate24H);
							}}
							text='Start Backtest'/>
				</div>
				<div className="section pet-section">
					<h3 className="section-title">
						<span className="primary-color">02. </span>Pet Projects
					</h3>
					<PdClock />
				</div>
			</div>
		</>
	);
}

export default App;
