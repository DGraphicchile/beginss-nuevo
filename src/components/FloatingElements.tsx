import { Sparkles, Heart, Leaf, Users, Star, Flower } from 'lucide-react';

export default function FloatingElements() {
  const elements = [
    { Icon: Sparkles, color: '#e74865', size: 24, top: '10%', left: '5%', delay: '0s' },
    { Icon: Heart, color: '#e74865', size: 28, top: '25%', right: '8%', delay: '1s' },
    { Icon: Leaf, color: '#7CA982', size: 32, top: '60%', left: '10%', delay: '2s' },
    { Icon: Users, color: '#CDE6E0', size: 26, top: '80%', right: '15%', delay: '1.5s' },
    { Icon: Star, color: '#F8E5C9', size: 22, top: '45%', right: '5%', delay: '2.5s' },
    { Icon: Flower, color: '#e74865', size: 30, top: '70%', left: '90%', delay: '0.8s' },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {elements.map((element, index) => {
        const { Icon, color, size, top, left, right, delay } = element;
        const style: React.CSSProperties = {
          position: 'absolute',
          top,
          ...(left ? { left } : { right }),
          color,
          animationDelay: delay,
        };

        return (
          <div
            key={index}
            className="animate-float opacity-20"
            style={style}
          >
            <Icon size={size} />
          </div>
        );
      })}
    </div>
  );
}
