import { useEffect, useState } from 'react';
import styles from "../styles/Home.module.css"
import ExtraInfo from '@/features/ExtraIfo';

export default function Home() {
  const [data, setData] = useState(null);
  const [currentTerm, setCurrentTerm] = useState(null);
  const [sentimentData, setSetintimenData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/fetchSearchTermData');
      const result = await response.json();
      setData(result);
    };
    fetchData();
  }, []);

  const fetchSentimentData = async (searchTerm) => {
    const response = await fetch(`/api/fetchSentimentData?term=${searchTerm}`);
    const result = await response.json();
    setSetintimenData(result);
    console.log("sentimentData", result);
  };
  useEffect(() => {
    currentTerm && fetchSentimentData(currentTerm);
  }, [currentTerm])

  if (!data) return <div>Loading...</div>;

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

  return (
    <div className={styles.center}>
      <h1>Sentiment Analysis</h1>
      <ul className={styles.flexList}>
        {data[0]?.search_term.map((term, index) => (
          <li key={index} className={styles.li} onClick={() => setCurrentTerm(term)}>
              {currentTerm === term ? <b><u>{term}</u></b> : term}
          </li>
        ))}
      </ul>
      <h4>{`Average Sentiment for ${currentTerm} as number: ${sentimentData?.reduce((sum, data) => sum + data?.average_sentiment, 0)}`}</h4>
      <h4>{`Average Sentiment for ${currentTerm} as strubg: ${avgSentimentToString(sentimentData?.reduce((sum, data) => sum + data?.average_sentiment, 0))}`}</h4>
      {/* <h4>{`Total Good Sentiment for ${currentTerm}: ${sentimentData?.reduce((sum, data) => sum + data?.reduce((sum2, data2) => sum2 + (data2.all_sentiment.positive).length, 0), 0)}`}</h4> */}
      <div className={styles.addTopMargin} />
      <div className={styles.center}>
      {sentimentData && <table className={styles.tableCenter}>
        <th>UserId</th>
        <th>Average Sentiment as a Number</th>
        <th>Average Sentiment as a String</th>
        <th>Click Chevron to see more</th>
        {sentimentData?.map((data) => <ExtraInfo sentimentData={data} />)}
      </table>}
      </div>
    </div>
  );
}

        //   let seeMore = false;
        //   return (
        //   <>
        //   <tr>
        //     <td>
        //       {data.userId}
        //     </td>
        //     <td>
        //       {data.average_sentiment}
        //     </td>
        //     <td>
        //       {avgSentimentToString(data.average_sentiment)}
        //     </td>
        //     <td>
        //       <div onClick={() => seeMore = !seeMore}>
        //         <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-chevron-down" viewBox="0 0 20 20" fill="currentColor" width="24" height="24">
        //           <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
        //         </svg>
        //       </div>
        //     </td>
        //   </tr>
        //   {seeMore &&
        //     <tr>
        //       <td>Extra Info</td>
        //       <td>Milk</td>
        //     </tr>
        //   }
          
        // </>
