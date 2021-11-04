import React from 'react';
import ItemCard from '../../itemCard';

export default function PointItemCard({itemName, point, description, styleType, onPress}) {
    const mainTextLeft = itemName + ':';
    const mainTextRight = `${point} ${point > 1 ? 'pts' : 'pt'}`;
    return (
        <ItemCard 
            mainTextLeft={mainTextLeft} 
            mainTextRight={mainTextRight}
            subText={description}
            styleType={styleType}
            onPress={onPress}
        />
    );
}
