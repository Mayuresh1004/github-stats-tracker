"use client";
import { GitHubCalendar } from 'react-github-calendar';
import { useState } from 'react';
  
  export default function GitHubCalendarWidget() {
  const [tip, setTip] = useState(null);
    return (
      <div style={{ padding: '32px', background: '#0a0a0a', borderRadius: '8px' }}>
        <GitHubCalendar
          username="Mayuresh1004"
          colorScheme="dark"
          theme={{ dark: ["#141414","#1e3a2f","#2d6a4f","#40916c","#52b788"] }}
          blockSize={12}
          blockMargin={4}
          
        renderBlock={(block, activity) => {
          const handleEnter = (e:any) => {
            const r = e.currentTarget.getBoundingClientRect();
            //@ts-ignore
            setTip({ x: r.left + r.width / 2, y: r.top - 8, content: activity.count + ' contribution' + (activity.count !== 1 ? 's' : '') });
          };
          return <g onMouseEnter={handleEnter} onMouseLeave={() => setTip(null)} style={{ cursor: 'pointer' }}><rect x={block.props.x} y={block.props.y} width={block.props.width} height={block.props.height} fill={block.props.fill} /></g>;
        }}
        //@ts-ignore
          hideTotalCount={false}
          hideColorLegend={false}
        />
        
      {tip && <div 
        //@ts-ignore
       style={{ position: 'fixed', left: tip.x + 'px', top: tip.y + 'px', transform: 'translate(-50%, -100%)', background: '#383838', color: '#fff', padding: '6px 10px', borderRadius: '6px', fontSize: '11px', whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 1000 }}>{tip.content}
       </div>}
      </div>
    );
  }