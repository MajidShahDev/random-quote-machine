import { useState, useEffect } from "react";
import { FaXTwitter } from "react-icons/fa6";
import { BiSolidQuoteLeft } from "react-icons/bi";

import "./App.css";

interface Quote {
  quote: string;
  author: string;
}

// Generate a random HSL color
const getRandomHSL = () => {
  const hue = Math.floor(Math.random() * 360); // 0 to 359
  const saturation = 100;
  const lightness = 40;
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

export default function RandomQuoteMachine() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [randomQuote, setRandomQuote] = useState<Quote | null>(null);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [randomColor, setRandomColor] = useState(getRandomHSL());
  const [isHoverX, setIsHoverX] = useState(false);
  const [isActiveX, setIsActiveX] = useState(false);
  const [isHoverBtn, setIsHoverBtn] = useState(false);
  const [isActiveBtn, setIsActiveBtn] = useState(false);
  const [transitionEnabled, setTransitionEnabled] = useState(false);

  const changeColor = () => {
    setRandomColor(getRandomHSL());
  };

  const adjustHSL = (hsl: string, lightnessOffset: number): string => {
    const regex = /hsl\((\d+),\s*(\d+)%?,\s*(\d+)%?\)/;
    const match = hsl.match(regex);

    if (!match) return hsl;

    const [, h, s, l] = match;
    const newL = Math.max(0, Math.min(100, parseInt(l) + lightnessOffset));
    return `hsl(${h}, ${s}%, ${newL}%)`;
  };

  const fetchData = async () => {
    try {
      const response = await fetch(
        // "https://reqres.in/api/users?delay=3"
        "https://gist.githubusercontent.com/camperbot/5a022b72e96c4c9585c32bf6a75f62d9/raw/e3c6895ce42069f0ee7e991229064f167fe8ccdc/quotes.json"
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Page Not Found (404)");
        } else if (response.status === 500) {
          throw new Error("Internal Server Error (500)");
        } else {
          throw new Error(`HTTP error: (${response.status})`);
        }
      }

      const data = await response.json();
      setQuotes(data.quotes);
      if (data.quotes.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.quotes.length);
        setRandomQuote(data.quotes[randomIndex]);
      }
    } catch (error) {
      console.error("Error Fetching Data:", error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Unknown error occured");
      }
    } finally {
      setIsLoading(false); // Finally must be run either try or catch excutes.
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTransitionEnabled(true);
    }, 100); // small delay to skip first paint

    return () => clearTimeout(timer);
  }, []);

  const transitionStyle = transitionEnabled
    ? { transition: "all 1s ease" }
    : { transition: "none" };

  const getRandomQuote = () => {
    if (quotes.length > 0) {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      setRandomQuote(quotes[randomIndex]);
    }
  };

  if (isLoading)
    return (
      <div id="container-loader">
        <div id="loading" className="loader"></div>
      </div>
    );
  if (error)
    return (
      <div id="container-error">
        <div id="error">{error}</div>
      </div>
    );
  if (quotes.length === 0)
    return (
      <div id="container-empty-data">
        <div id="empty-data">No Data Available</div>
      </div>
    );

  return (
    <>
      {randomQuote && (
        <div
          id="background"
          style={{
            backgroundColor: randomColor,
            ...transitionStyle,
            width: "100%",
          }}
        >
          <div
            id="quote-box"
            style={{
              border: `8px solid ${adjustHSL(randomColor, 5)}`,
              ...transitionStyle,
            }}
          >
            <p
              id="text"
              style={{ color: adjustHSL(randomColor, -5), ...transitionStyle }}
            >
              <span id="quote-start">
                <BiSolidQuoteLeft />{" "}
              </span>
              {randomQuote.quote || "No quote available"}
            </p>
            <p
              id="author"
              style={{ color: adjustHSL(randomColor, -6), ...transitionStyle }}
            >
              - {randomQuote.author || "Unknown"}
            </p>

            <div id="twitter-new-quote">
              <div>
                <a
                  id="tweet-quote"
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                    `"${randomQuote.quote}" - ${randomQuote.author}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => setIsHoverX(true)}
                  onMouseLeave={() => {
                    setIsHoverX(false);
                    setIsActiveX(false);
                  }}
                  onMouseDown={() => setIsActiveX(true)}
                  onMouseUp={() => setIsActiveX(false)}
                  style={{
                    backgroundColor: isActiveX
                      ? adjustHSL(randomColor, -15)
                      : isHoverX
                      ? adjustHSL(randomColor, -10)
                      : randomColor,
                    ...(isHoverX ? {} : transitionStyle),
                  }}
                >
                  <FaXTwitter />
                </a>
              </div>

              <button
                id="new-quote"
                onClick={() => {
                  getRandomQuote();
                  changeColor();
                }}
                onMouseEnter={() => setIsHoverBtn(true)}
                onMouseLeave={() => {
                  setIsHoverBtn(false);
                  setIsActiveBtn(false);
                }}
                onMouseDown={() => setIsActiveBtn(true)}
                onMouseUp={() => setIsActiveBtn(false)}
                style={{
                  backgroundColor: isActiveBtn
                    ? adjustHSL(randomColor, -15)
                    : isHoverBtn
                    ? adjustHSL(randomColor, -10)
                    : randomColor,
                  ...(isHoverBtn ? {} : transitionStyle),
                }}
              >
                New Quote
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
