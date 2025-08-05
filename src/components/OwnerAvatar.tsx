import React from 'react';
import styled from '@emotion/styled';
import { Owner } from '../types/dependencyMap';

interface OwnerAvatarProps {
  owner: Owner;
  size?: number;
  showTooltip?: boolean;
}

const AvatarContainer = styled.div<{ size: number }>`
  position: relative;
  display: inline-block;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #DFE1E6;
  background: white;
  cursor: pointer;
  
  &:hover {
    border-color: #0052CC;
  }
`;

const AvatarImage = styled.img<{ size: number }>`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Tooltip = styled.div`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border: 1px solid #DFE1E6;
  border-radius: 6px;
  padding: 8px 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  font-size: 12px;
  white-space: nowrap;
  z-index: 1000;
  margin-bottom: 4px;
  
  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 4px solid transparent;
    border-top-color: white;
  }
`;

const OwnerAvatar: React.FC<OwnerAvatarProps> = ({ owner, size = 24, showTooltip = true }) => {
  const [showTooltipState, setShowTooltipState] = React.useState(false);

  return (
    <AvatarContainer 
      size={size}
      onMouseEnter={() => setShowTooltipState(true)}
      onMouseLeave={() => setShowTooltipState(false)}
    >
      <AvatarImage 
        src={owner.avatar} 
        alt={owner.name}
        size={size}
        onError={(e) => {
          // Fallback to initials if image fails to load
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          const parent = target.parentElement;
          if (parent) {
            parent.style.backgroundColor = '#0052CC';
            parent.style.display = 'flex';
            parent.style.alignItems = 'center';
            parent.style.justifyContent = 'center';
            parent.style.color = 'white';
            parent.style.fontSize = `${Math.max(8, size * 0.4)}px`;
            parent.style.fontWeight = 'bold';
            parent.textContent = owner.name.split(' ').map(n => n[0]).join('');
          }
        }}
      />
      {showTooltip && showTooltipState && (
        <Tooltip>
          <div><strong>{owner.name}</strong></div>
          <div style={{ color: '#6B778C', fontSize: '11px' }}>{owner.email}</div>
        </Tooltip>
      )}
    </AvatarContainer>
  );
};

export default OwnerAvatar; 