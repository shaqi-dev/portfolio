import React from "react";
import "./hero.css";

function Hero() {
    return (
        <>
            <h2 className="hero-code">Hello World! My name is</h2>
            <h1 className="hero-title">Vladislav Zubakin.</h1>
            <h1 className="hero-subtitle">I love learning new things!</h1>
            <div className="hero-descr">
                <p className="hero-descr__paragraph">I'm a Junior Front-end developer from Belarus with a passion for learning and innovating.</p>
                <p className="hero-descr__paragraph">Currently I'm looking for my first job as a Front-end developer.</p>
                <p className="hero-descr__paragraph">Outside of work, I'm trading cryptocurrencies, producing music and playing computer games with my friends.</p>
            </div>
        </>
    )
}

export default Hero;