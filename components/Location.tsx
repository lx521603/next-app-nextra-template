'use client';

import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';

interface LocationProps {
  address: string;
}

const Location: React.FC<LocationProps> = ({ address }) => {
  const [deviceType, setDeviceType] = useState<'ios' | 'mac' | 'android' | 'other'>('other');
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const detectDevice = () => {
      if (typeof window === 'undefined') return 'other';
      const userAgent = navigator.userAgent;
      if (/iPad|iPhone|iPod/.test(userAgent)) return 'ios';
      if (navigator.platform.includes('Mac')) return 'mac';
      if (/Android/.test(userAgent)) return 'android';
      return 'other';
    };
    setDeviceType(detectDevice());
  }, []);

  const getStoreName = (addr: string) => {
    const cleanName = addr.split('•')[0].split(' ')[0];
    return cleanName.length > 10 ? cleanName.substring(0, 10) + '...' : cleanName;
  };

  const openBestMapApp = () => {
    const encodedAddress = encodeURIComponent(address);
    const mapUrls = [
      `amapuri://route/plan/?dname=${encodedAddress}`,
      `baidumap://map/geocoder?address=${encodedAddress}`,
      `qqmap://map/routeplan?type=drive&to=${encodedAddress}`,
      `https://map.baidu.com/mobile/webapp/search/search/qt=s&wd=${encodedAddress}`
    ];
    for (let i = 0; i < mapUrls.length - 1; i++) {
      const opened = window.open(mapUrls[i], '_blank');
      if (opened && !opened.closed) return;
    }
    window.open(mapUrls[mapUrls.length - 1], '_blank');
  };

  const handleLocationClick = () => {
    if (deviceType === 'ios' || deviceType === 'mac') {
      window.open(`https://maps.apple.com/?q=${encodeURIComponent(address)}`, '_blank');
    } else {
      openBestMapApp();
    }
  };

  const storeName = getStoreName(address);

  return (
    <div
      onClick={handleLocationClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px',
        backgroundColor: isHovered ? '#f0f9ff' : 'white',
        border: `1px solid ${isHovered ? '#3b82f6' : '#d1d5db'}`,
        borderRadius: '12px',
        boxShadow: isHovered ? '0 4px 12px rgba(0,0,0,0.1)' : '0 1px 3px rgba(0,0,0,0.05)',
        cursor: 'pointer',
        maxWidth: '200px',
        width: '100%',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        transition: 'all 0.2s ease-in-out',
        transform: isHovered ? 'translateY(-1px)' : 'none'
      }}
    >
      {/* 图标 */}
      <div style={{
        width: '32px',
        height: '32px',
        backgroundColor: isHovered ? '#3b82f6' : '#dbeafe',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        transition: 'all 0.2s ease-in-out'
      }}>
        <MapPin 
          size={16} 
          color={isHovered ? 'white' : '#3b82f6'}
        />
      </div>
      
      {/* 文字内容 */}
      <span style={{
        fontSize: '14px',
        fontWeight: '600',
        color: isHovered ? '#1e40af' : '#1f2937',
        flex: 1,
        minWidth: 0,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        transition: 'color 0.2s ease-in-out'
      }}>
        {storeName}
      </span>
    </div>
  );
};

export default Location;