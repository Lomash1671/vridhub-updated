import { useNavigate, Outlet } from 'react-router-dom';
import bookingImg from '../../assets/transportbooking.jpeg';
import carpoolingImg from '../../assets/carpooling2.jpeg';
import { Helmet } from 'react-helmet';
import Footer from '../Footer';
import '../../styles/transport/Transport.css';

const tilesData = [
  {
    title: 'Book Cab',
    imgSrc: bookingImg,
    link: '/transport/book-cab',
    alt: 'Book Cab',
  },
  {
    title: 'Carpool',
    imgSrc: carpoolingImg,
    link: '/transport/carpool',
    alt: 'Carpool',
  },
];

const Transport = () => {
  const navigate = useNavigate();

  const handleTileClick = (link) => {
    navigate(link);
  };

  return (
    <>
      <Helmet>
        <title>Transport</title>
      </Helmet>
      <div className="transport-container">
        <h1 className="transport-title">Elderly Travel Assistance</h1>
        <div className="row justify-content-center mt-5">
          {tilesData.map((tile, index) => (
            <div className="col-lg-4 col-md-6 col-sm-12 mb-4" key={index}>
              <div className="tile-card" onClick={() => handleTileClick(tile.link)}>
                <img src={tile.imgSrc} alt={tile.alt} className="tile-img" />
                <div className="card-body">
                  <h5 className="tile-title">{tile.title}</h5>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default Transport;