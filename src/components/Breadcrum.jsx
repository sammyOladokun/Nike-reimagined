import { ChevronRight } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

const categoryRoutes = {
  men: '/mens',
  women: '/womens',
  kid: '/kids',
};

const Breadcrum = (props) => {
    const { product } = props;
    const categoryRoute = categoryRoutes[product?.category] ?? '/mens';

   return (
    <div className='flex flex-wrap items-center md:gap-2 gap-1 px-6 md:px-0 text-[#5e5e5e] font-semibold md:text-lg capitalize mt-4 text-sm'>
      <Link to='/' className='hover:text-[#138695] transition-colors'>Home</Link>
      <ChevronRight size={16} />
      <Link to='/mens' className='hover:text-[#138695] transition-colors'>Shop</Link>
      <ChevronRight size={16} />
      <Link to={categoryRoute} className='hover:text-[#138695] transition-colors'>
        {product?.category}
      </Link>
      <ChevronRight size={16} />
      <span className='text-gray-800'>{product?.name}</span>
    </div>
  )
}

export default Breadcrum
