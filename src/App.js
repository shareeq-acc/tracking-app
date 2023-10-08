import { useState } from 'react';
import './App.css';

function App() {
  const [trackingNum, setTrackingNum] = useState("");
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const apiKey = "ZTM3ODgzOWNjNmY4NDdjODkwMWM3YmRjNmY4NjcwYWQ6MmUwY2U3OWNjN2M1NDU3ODg2ZmQ5OGMzYThmODQzMzQ";

  const formatDate = (str, bool) => {
    str = str? str : ""
    const months = ["", "January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    const strArr = str.split("-")
    const strMonth = strArr[1]
    let strDay = strArr[2]
    if(bool){
      strDay = strDay.substring(0, 2);
    }
    return `${strDay} ${months[parseInt(strMonth)]} ${strArr[0]}`
  }

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (trackingNum?.length === 0) {
      setError("Enter Tracking Number")
      return
    }
    try {
      const url = `https://api.postex.pk/services/integration/api/order/v1/track-order/${trackingNum}`
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "token": apiKey
        },
      });
      const parseData = await response.json()
      if (parseData.statusCode === "404") {
        setError("Record Not Found")
        setData(null)
        return
      }
      setData(parseData.dist)
    } catch (error) {
      console.log(error)
      setError("Something Went Wrong!")
      setData(null);
    }
  }
  return (
    <div className="tracking-page">
      <form className='tracking__form'>
        <h1 className='tracking__title'>Track Your Parcel</h1>
        <div className='tracking__form-wrap'>
          <input className='tracking__form--input' placeholder='Enter Tracking Number' onChange={(e) => setTrackingNum(e.target.value)} />
          <button className='tracking__form--submit-btn btn' onClick={handleSubmit}>Track</button>
        </div>
        <p className='tracking__error'>{error}</p>
      </form>
      {data && <div className='tracking__result-wrap'>
        <table className='tracking__table'>
          <tbody className='tracking__table-body'>
            <tr className='tracking__table-row'>
              <td className='tracking__table-data tracking__table-field'>Shipper</td>
              <td className='tracking__table-data tracking__table-value'>{data?.merchantName}</td>
            </tr>
            <tr className='tracking__table-row'>
              <td className='tracking__table-data tracking__table-field'>Consignee</td>
              <td className='tracking__table-data tracking__table-value'>{data?.customerName}</td>
            </tr>
            <tr className='tracking__table-row'>
              <td className='tracking__table-data tracking__table-field'>Origin / Destination</td>
              <td className='tracking__table-data tracking__table-value'>{`${data?.cityName == "Karachi" ? "KHI" : `KHI / ${data.cityName}`}`}</td>
            </tr>
            <tr className='tracking__table-row'>
              <td className='tracking__table-data tracking__table-field'>Current Status</td>
              <td className='tracking__table-data tracking__table-value'>{data?.transactionStatus}</td>
            </tr>
          </tbody>
        </table>
        <div className='tracking__history'>
          {
            data?.transactionStatusHistory && data.transactionStatusHistory.map((item, index) => (
              <div className='tracking__history__individual' key={index}>
                <div className="tracking--point-wrap">
                  <div className={`${index === 0 ? "tracking--point-first" : "tracking--point"}`}></div>
                </div>
                <div className='tracking__history__details'>
                  <h3 className='tracking__history__title'>{item.transactionStatusMessage}</h3>
                  <span className='tracking__history__date'>Date: {formatDate(item.updatedAt, true)}</span>
                  {/* <span className='tracking__history__location'>Location KHI</span> */}
                </div>
              </div>
            ))
          }
          {/* <div className='tracking__history__individual'>
            <div className='tracking--point-wrap'>
              <div className='tracking--point-first'></div>
            </div>
            <div className='tracking__history__details'>
              <h3 className='tracking__history__title'>CONSIGNMENT BOOKED</h3>
              <span className='tracking__history__date'>Date: 30-Sep-23</span>
              <span className='tracking__history__location'>Location KHI</span>
            </div>
          </div>
          <div className='tracking__history__individual'>
            <div className='tracking--point-wrap'>
              <div className='tracking--point'></div>
            </div>
            <div className='tracking__history__details'>
              <h3 className='tracking__history__title'>PICKED FROM SHIPPER</h3>
              <span className='tracking__history__date'>Date: 30-Sep-23</span>
              <span className='tracking__history__location'>Location KHI</span>
            </div>
          </div> */}
          {/* <div className='tracking__history__individual'>
            <div className='tracking--point-wrap'>
              <div className='tracking--point'></div>
            </div>
            <div className='tracking__history__details'>
              <h3 className='tracking__history__title'>ARRIVED AT ORIGIN BRANCH</h3>
              <span className='tracking__history__date'>Date: 01-Oct-23</span>
              <span className='tracking__history__location'>Location KHI</span>
            </div>
          </div> */}
        </div>
      </div>}
    </div>
  );
}

export default App;
