function getLexxService(s)  {
    return `https://lexxtg.com/bot#t=s&s=binance:${s[0]}&tf=${s[1]}&bi=${s[2].toLowerCase()}&bt=${s[3]}&st=${s[4]}&sl=${s[5]}&tc=r&as=1&tu=1&oc=1&stt=${s[3] > 2 ? (s[3] - 1).toFixed(2) : 1}&slc=0&slcp=0`
}

export default getLexxService;