function createOptions(buyRange, sellRange, stopRange, maxSellRate = 0.8, maxStopRate = 0.8) {

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

export default createOptions;