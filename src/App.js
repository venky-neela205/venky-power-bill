import { useRef, useState } from "react";
import Webcam from "react-webcam";
import Tesseract from "tesseract.js";
import { GrPowerReset } from "react-icons/gr";

import "./App.css";

let fixedCharges = 0;
let custCharges = 0;
let elecDuties = 0;
let EDINT = 0;
let addlCharges = 0;
let surCharges = 0;
let INT = 0;
let billAmount = 0;
let lossGain = 0;
let netAmount = 0;

const App = () => {
  const webcamRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState("");
  const [units, setUnits] = useState("");
  const [progress, setProgress] = useState(0);
  const [energyCharges, setEnergyCharges] = useState(0);
  const [showPicture, setShowPicture] = useState(false);

  const capture = () => {
    const image = webcamRef.current.getScreenshot();
    setImage(image);
    setShowPicture(true);
  };

  const handleRetake = () => {
    setImage("");
    setShowPicture(false);
  };

  const handleSubmit = () => {
    setIsLoading(true);
    Tesseract.recognize(image, "eng", {
      logger: (m) => {
        console.log(m);
        if (m.status === "recognizing text") {
          setProgress(parseInt(m.progress * 100));
        }
      },
    })
      .catch((err) => {
        console.error(err);
      })
      .then((result) => {
        console.log(result.data);
        setUnits(result.data.text);
        setIsLoading(false);
      });
  };

  const calculateBillAmount = () => {
    let amount = 0;
    if (units <= 100) {
      amount = units <= 50 ? (amount = 50) : 50 * 1.95 + (units - 50) * 3.1;
    } else if (units <= 200) {
      amount = 100 * 3.4 + (units - 100) * 4.8;
    } else {
      amount = 100 * 3.4 + 100 * 4.8;
      if (units <= 300) {
        amount += (units - 200) * 7.7;
      } else if (units <= 400) {
        amount += 100 * 7.7 + (units - 300) * 9.0;
      } else if (units <= 800) {
        amount += 100 * 7.7 + 100 * 9.0 + (units - 400) * 9.5;
      } else {
        amount += 100 * 7.7 + 100 * 9.0 + 400 * 9.5 + (units - 800) * 10.0;
      }
    }
    setEnergyCharges(amount.toFixed(2));
    if (units <= 50) {
      custCharges = 40.0;
    } else if (units <= 100) {
      custCharges = 70.0;
    } else if (units <= 200) {
      custCharges = 90.0;
    } else if (units <= 300) {
      custCharges = 100.0;
    } else if (units <= 400) {
      custCharges = 120.0;
    } else if (units <= 800) {
      custCharges = 140.0;
    } else {
      custCharges = 160.0;
    }
    fixedCharges = 10.0;
    elecDuties = units * (6 / 100);
    elecDuties = elecDuties.toFixed(2);
    billAmount = amount + fixedCharges + custCharges + parseFloat(elecDuties);
    netAmount = Math.round(billAmount);
    lossGain = billAmount - netAmount;
    lossGain = lossGain.toFixed(2);
  };

  return (
    <div className="container">
      <div className="cards-container">
        <div className="col-md-5 mx-auto h-100 d-flex flex-column justify-content-center">
          {!isLoading && (
            <div className="camera-card">
              {!showPicture ? (
                <Webcam
                  className="webcam"
                  audio={false}
                  ref={webcamRef}
                  videoConstraints={{
                    facingMode: "environment",
                  }}
                />
              ) : (
                <img src={image} alt="captured pic" />
              )}
              <div className="capture-reset">
                <button
                  className="capture-icon"
                  type="button"
                  onClick={capture}
                ></button>
                <GrPowerReset
                  className="reset"
                  type="button"
                  onClick={handleRetake}
                />
              </div>
            </div>
          )}
          {isLoading && (
            <div>
              <progress className="progress" value={progress} max="100">
                {progress}%{" "}
              </progress>
              <p>{progress} %</p>
            </div>
          )}
          {!isLoading && !units && (
            <div className="choose-file-container">
              <input
                className="file-input"
                type="file"
                onChange={(e) =>
                  setImage(URL.createObjectURL(e.target.files[0]))
                }
              />
              <div className="convert-container">
                <input
                  type="button"
                  onClick={handleSubmit}
                  className="convert"
                  value="Convert"
                />
              </div>
            </div>
          )}
          {!isLoading && units && (
            <div className="convert-container">
              <textarea
                className="textarea"
                rows="2"
                value={units}
                onChange={(e) => setUnits(e.target.value)}
              ></textarea>
            </div>
          )}
          <div>
            <div className="convert-container">
              <input
                className="units-input"
                type="number"
                id="units"
                value={units}
                onChange={(e) => setUnits(e.target.value)}
              />
            </div>
            <div className="convert-container">
              <button className="button" onClick={calculateBillAmount}>
                Calculate Bill Amount
              </button>
            </div>
            <ul className="bill-details">
              <li className="li-elements">
                Energy charges: <span className="span">{energyCharges}</span>
              </li>
              <li className="li-elements">
                Fixed Charges: <span className="span">{fixedCharges}</span>
              </li>
              <li className="li-elements">
                Customer Charges: <span className="span">{custCharges}</span>
              </li>
              <li className="li-elements">
                Electricity Duties: <span className="span">{elecDuties}</span>
              </li>
              <li className="li-elements">
                EDINT: <span className="span">{EDINT}</span>
              </li>
              <li className="li-elements">
                Additional Charges: <span className="span">{addlCharges}</span>
              </li>
              <li className="li-elements">
                ACD sur Charges: <span className="span">{surCharges}</span>
              </li>
              <li className="li-elements">
                INT on SD: <span className="span">{INT}</span>
              </li>
              <li className="li-elements">
                Bill Amount: <span className="span">{billAmount}</span>{" "}
              </li>
              <li className="li-elements">
                Loss/Gain: <span className="span">{lossGain}</span>
              </li>
              <li className="li-elements">
                Net Amount: <span className="span">{netAmount}</span>{" "}
              </li>
            </ul>
            <div className="total-bill">
              <h1>Total Amount: {netAmount} </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
