import React from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import meetingImg from '../../assets/community.webp'; // Adjust the image path
import inter from '../../assets/intergerenationalmeetups.jpeg';  // Adjust the image path
import { Helmet } from 'react-helmet';
import Footer from '../Footer';

// Tile data array
const tilesData = [
  {
    title: 'Community',
    imgSrc: meetingImg,
    link: '/isolation/community',
    alt: 'Community',
  },
  {
    title: 'Intergenerational',
    imgSrc: inter,
    link: '/isolation/intergenerational',
    alt: 'Intergenerational',
  },
];

const Isolation = () => {
  const navigate = useNavigate(); // Hook to navigate programmatically

  const handleTileClick = (link) => {
    navigate(link); // Navigate to the link passed when tile is clicked
  };

  return (
    <>
    <Helmet>
      <title>Isolation</title>
    </Helmet>
    <div className="container text-center mt-4" style={{ fontFamily: 'Times New Roman, serif' }}>
      <h1 className="display-4 font-weight-bold">Comprehensive Elder Care</h1>

      <div className="row justify-content-center mt-5">
        {tilesData.map((tile, index) => (
          <div className="col-lg-4 col-md-6 col-sm-12 mb-4" key={index}>
            <div
              className="card h-100 shadow-sm"
              onClick={() => handleTileClick(tile.link)}
              style={{ cursor: 'pointer', transition: 'transform 0.3s ease' }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <img
                src={tile.imgSrc}
                alt={tile.alt}
                className="card-img-top img-fluid"
                style={{ height: '200px', objectFit: 'cover', transition: 'transform 0.3s ease' }}
              />
              <div className="card-body">
                <h5 className="card-title" style={{ transition: 'color 0.3s ease' }}>{tile.title}</h5>
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

export default Isolation;
