import { useState } from "react";
import styles from "../styles/Home.module.css"

export default function ExtraInfo({sentimentData}){
    const [seeMore, setSeeMore] = useState(false);
    console.log("here", sentimentData);
    return (
        <>
        <tr>
          <td>
            {sentimentData.userId}
          </td>
          <td>
            {sentimentData.average_sentiment}
          </td>
          <td>
            {avgSentimentToString(sentimentData.average_sentiment)}
          </td>
          <td>
            <div onClick={() => setSeeMore((prev) => !prev)}>
              <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-chevron-down" viewBox="0 0 20 20" fill="currentColor" width="24" height="24">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </div>
          </td>
        </tr>
        {seeMore &&
        <tr>
        <table>
                <tr>
                    <th>Article Titles</th>
                    <th>Sentiment of Article</th>
                    <th>Positive Words</th>
                    <th>Negative Words</th>
                </tr>
                {sentimentData.article_title_info.map((article) => {
                    return(
                        <tr>
                            <td>{article?.name}</td>
                            <td>{article?.all_sentiment?.score}</td>
                            <td>{article?.all_sentiment?.positive.map((word) => <p>{word}</p>)}</td>
                            <td>{article?.all_sentiment?.negative.map((word) => <p>{word}</p>)}</td>
                        </tr>
                    );
                })}
        </table>
        </tr>
        }
        </>
    );
}


function avgSentimentToString(sentiment){
    switch (true) {
      case sentiment === 0:
        return "Nuetral";
      case sentiment > 0  && sentiment < 1.5:
        return "Good";
      case sentiment < 0  && sentiment > -1.5:
        return "Bad";
      case sentiment >= 1.5:
        return "Very Good";
      case sentiment <= -1.5:
        return "Very Bad";
    }
}
