import React from "react";
import Header from "./src/components/header/Header";
import Count from "./src/components/countdown/Count";
import Ceremony from "./src/components/ceremony/Ceremony";
import Location from "./src/components/ceremony/Location";
import Regalo from "./src/components/regalo/Regalo";
import Rsvp from "./src/components/rsvp/Rsvp";
import Bottom from "./src/components/rsvp/Bottom";

const Home = () => {
  return (
    <div>
      <Header />
      <Count />
      <Ceremony />
      <Location />
      <Regalo />
      <Rsvp />
      <Bottom />
    </div>
  );
};

export default Home;
