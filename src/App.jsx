import React, { useEffect, useRef, useState } from "react";
import TranslateChat from "./components/TranslateChat";

function App() {
  const connect = window.connect;
  // useEffect(() => {}, [connect]);
  return (
    <div>
      {connect ? (
        <div className="container" style={{ display: "flex", gap: 10 }}>
          <CCP />
          <TranslateChat />
          {/* <TranslateText text={'hola'} lang={'en'} /> */}
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

function CCP() {
  const connect = window.connect;
  var containerDiv = useRef();

  useEffect(() => {
    var instanceURL = "https://avran.my.connect.aws/ccp-v2/";
    //var samlLoginURL = "https://myapps.microsoft.com/signin/fc5de8b2-baff-45fe-bf2f-dd8cfaa9d588?tenantId=8adfb103-6b74-4c47-a968-bca7e945f76a";
    connect.core.initCCP(containerDiv.current, {
      ccpUrl: instanceURL, // REQUIRED
      //loginUrl: samlLoginURL,
      loginPopup: true, // optional, defaults to `true`
      loginPopupAutoClose: true, // optional, defaults to `true`
      loginOptions: {
        // optional, if provided opens login in new window
        autoClose: true, // optional, defaults to `false`
        height: 825, // optional, defaults to 578
        width: 380, // optional, defaults to 433
        top: 0, // optional, defaults to 0
        left: 0, // optional, defaults to 0
      },
      region: "eu-west-2", // REQUIRED for `CHAT`, optional otherwise
      softphone: {
        // optional
        allowFramedSoftphone: true, // optional
        disableRingtone: false, // optional
      },
      pageOptions: {
        //optional
        enableAudioDeviceSettings: true, //optional, defaults to 'false'
        enablePhoneTypeSettings: true, //optional, defaults to 'true'
      },
    });
  }, []);
  return (
    <div className="CCP">
      <div
        className="container-div"
        ref={containerDiv}
        style={{ width: 380, height: 825 }}
      ></div>
    </div>
  );
}

export default App;
