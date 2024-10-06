import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../component/ListingItem';
import { list } from 'firebase/storage';
export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation]);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch('/server/listing/get?offer=true&limit=4');
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
        console.log(data)
      } catch (error) {
        console.log(error);
      }
    };
    const fetchRentListings = async () => {
      try {
        const res = await fetch('/server/listing/get?type=rent&limit=4');
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };
    
    const fetchSaleListings = async () => {
      try {
        const res = await fetch('/server/listing/get?type=sale&limit=4');
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOfferListings();
  }, []);
  console.log(offerListings.imageUrls)
  return (
    <div className="bg-light-sky-blue">
      {/* Top section */}
      <div className="flex flex-col gap-6 p-8 lg:p-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-gray-800 font-extrabold text-3xl lg:text-6xl">
          Find your next{' '}
          <span className="text-blue-800">perfect</span>
          <br />
          place with Us
        </h1>
        <div className="text-gray-600 text-sm sm:text-base">
          Niwas Finder offers the best selection of properties in India,
          <br />
          helping you find the perfect home or investment opportunity.
        </div>
        <Link
          to={'/search'}
          className="text-sm sm:text-base text-blue-800 font-bold hover:underline"
        >
          Let's get started...
        </Link>
      </div>
      {/* Swiper for Offers */}
      <Swiper navigation className="w-full">
        {offerListings.map((listing) => (
          <SwiperSlide key={listing._id}>
              <div
                style={{
                  background: `url(${listing.imageUrls[0]}) center no-repeat`,
                  backgroundSize: 'cover',
                }}
                className="h-[500px] w-full relative"
              >
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center text-white text-4xl font-semibold">
                  {listing.title}
                </div>
              </div>
            </SwiperSlide>
          ))}
      </Swiper>

      {/* Listing Sections */}
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-12 my-10">
        {offerListings && offerListings.length > 0 && (
          <div className="border-b pb-6">
            <div className="my-3 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Latest Offers</h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to={'/search?offer=true'}
              >
                View More
              </Link>
            </div>
            <div className="flex flex-wrap gap-6">
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {rentListings && rentListings.length > 0 && (
          <div className="border-b pb-6">
            <div className="my-3 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">
                Places for Rent
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to={'/search?type=rent'}
              >
                View More
              </Link>
            </div>
            <div className="flex flex-wrap gap-6">
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {saleListings && saleListings.length > 0 && (
          <div>
            <div className="my-3 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">
                Places for Sale
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to={'/search?type=sale'}
              >
                View More
              </Link>
            </div>
            <div className="flex flex-wrap gap-6">
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
