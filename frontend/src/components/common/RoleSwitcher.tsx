import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Role } from '../../types';
import { ShieldCheck, Store, UserCheck, Sparkles, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const RoleSwitcher: React.FC = () => {
  const { role, switchRole } = useAuth();
  const navigate = useNavigate();

  const handleSwitch = (newRole: Role) => {
    switchRole(newRole);
    if (newRole === 'ROLE_ADMIN') {
      navigate('/admin');
    } else if (newRole === 'ROLE_MERCHANT') {
      navigate('/merchant/dispatch');
    } else if (newRole === 'ROLE_DELIVERY_PARTNER') {
      navigate('/delivery');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="bg-charcoal text-white text-xs py-1.5 px-4 border-b border-gold-500/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-gold-400 animate-pulse" />
          <span className="font-serif italic text-gold-200">
            Edris Perfume Ethiopia — Order Taking, Dispatch & Delivery Module
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-gray-400 mr-1 hidden sm:inline">Portal View:</span>
          
          <button
            onClick={() => handleSwitch('ROLE_CUSTOMER')}
            className={`px-2.5 py-1 rounded-full flex items-center gap-1 transition-all ${
              role === 'ROLE_CUSTOMER'
                ? 'bg-gold-500 text-white font-medium shadow-sm'
                : 'bg-charcoal-light/60 hover:bg-charcoal-light text-gray-300'
            }`}
          >
            <UserCheck className="w-3 h-3 text-gold-200" />
            <span>Customer</span>
          </button>

          <button
            onClick={() => handleSwitch('ROLE_MERCHANT')}
            className={`px-2.5 py-1 rounded-full flex items-center gap-1 transition-all ${
              role === 'ROLE_MERCHANT'
                ? 'bg-gold-500 text-white font-medium shadow-sm'
                : 'bg-charcoal-light/60 hover:bg-charcoal-light text-gray-300'
            }`}
          >
            <Store className="w-3 h-3 text-gold-200" />
            <span>Merchant Dispatch</span>
          </button>

          <button
            onClick={() => handleSwitch('ROLE_DELIVERY_PARTNER')}
            className={`px-2.5 py-1 rounded-full flex items-center gap-1 transition-all ${
              role === 'ROLE_DELIVERY_PARTNER'
                ? 'bg-gold-500 text-white font-medium shadow-sm'
                : 'bg-charcoal-light/60 hover:bg-charcoal-light text-gray-300'
            }`}
          >
            <Truck className="w-3 h-3 text-gold-200" />
            <span>Delivery Partner</span>
          </button>

          <button
            onClick={() => handleSwitch('ROLE_ADMIN')}
            className={`px-2.5 py-1 rounded-full flex items-center gap-1 transition-all ${
              role === 'ROLE_ADMIN'
                ? 'bg-gold-500 text-white font-medium shadow-sm'
                : 'bg-charcoal-light/60 hover:bg-charcoal-light text-gray-300'
            }`}
          >
            <ShieldCheck className="w-3 h-3 text-gold-200" />
            <span>Admin</span>
          </button>
        </div>
      </div>
    </div>
  );
};
