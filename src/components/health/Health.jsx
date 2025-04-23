import { useNavigate, Outlet } from 'react-router-dom';
import prescriptionImg from '../../assets/pres.jpg'; // Adjust the image path
import doctorImg from '../../assets/directory.jpg';  // Adjust the image path
import { Helmet } from 'react-helmet';
import Footer from '../Footer';
import '../../styles/health/Health.css';


// Tile data array
const tilesData = [
  {
    title: 'Prescription',
    imgSrc: prescriptionImg,
    link: '/health/prescription',
    alt: 'Prescription',
  },
  {
    title: 'Doctor Directory',
    imgSrc: doctorImg,
    link: '/health/doctor',
    alt: 'Doctor Directory',
  },
];

const Health = () => {
  const navigate = useNavigate();

  const handleTileClick = (link) => {
    navigate(link);
  };

  return (
    <>
      <Helmet>
        <title>Health</title>
      </Helmet>

      <div className="health-container">
        <h1 className="health-title">Comprehensive Elder Care</h1>

        <div className="health-row">
          {tilesData.map((tile, index) => (
            <div className="health-card" key={index} onClick={() => handleTileClick(tile.link)}>
              <img src={tile.imgSrc} alt={tile.alt} />
              <div className="card-body">
                <h5 className="card-title">{tile.title}</h5>
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

export default Health;
