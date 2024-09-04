import React from "react";
import "./Home.css"; // Import the CSS file

const Home = () => {
  return (
    <div className="main">
      <h1 className="home-title">
        Dobrodošli na Vaš Personalizovani Turistički Vodič!
      </h1>
      <div className="home-container">
        <div className="home-content">
          <p className="home-paragraph">
            Otkrijte čari putovanja na potpuno nov način uz naš interaktivni
            vodič! Kreirajte sopstvene rute kroz omiljene destinacije, dodajte
            specifične lokacije koje želite da istražite i sačuvajte svoje
            personalizovane ture za kasniju upotrebu. Bilo da ste avanturista u
            potrazi za novim izazovima ili turistički entuzijasta koji voli da
            istražuje skrivene dragulje, naš alat vam omogućava da dizajnirate
            putovanja po svojoj meri.
          </p>
          <ul className="home-list">
            <li>
              Kreirajte Lokacije: Unesite zanimljive lokacije koje želite da
              posetite ili koje ste već istražili.
            </li>
            <li>
              Povežite ih u Rute: Naš alat će automatski povezati vaše lokacije
              u logičnu putanju koju možete pratiti.
            </li>
            <li>
              Sačuvajte i Podelite: Čuvajte svoje rute i delite ih sa
              prijateljima ili sačuvajte za svoje buduće avanture.
            </li>
          </ul>
        </div>
        <img
          className="home-image"
          src="/img/home-slika.webp"
          alt="Tour Guide"
        />
      </div>
    </div>
  );
};

export default Home;
