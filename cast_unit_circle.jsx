import React, { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const CastUnitCircle = () => {
  const [angle, setAngle] = useState(0);
  const [mode, setMode] = useState('all');
  const [isEditing, setIsEditing] = useState(false);
  const [usePi, setUsePi] = useState(false);
  const [piDecimal, setPiDecimal] = useState(false);
  const [showShading, setShowShading] = useState(true);
  const [showTriangle, setShowTriangle] = useState(false);
  const [angleUnit, setAngleUnit] = useState('degree');

  const angleInDegrees = angleUnit === 'degree' ? angle : angleUnit === 'radian' ? angle * (180 / Math.PI) : angle * 0.9;
  const rad = (angleInDegrees * Math.PI) / 180;
  const x = Math.cos(rad);
  const y = -Math.sin(rad);

  const quadrant = () => {
    if (angle === 0 || angle === 360) return 'A';
    if (angle > 0 && angle < 90) return 'A';
    if (angle > 90 && angle < 180) return 'S';
    if (angle > 180 && angle < 270) return 'T';
    if (angle > 270 && angle < 360) return 'C';
    return '';
  };

  const waveData = Array.from({ length: 361 }, (_, i) => {
    const theta = (i * Math.PI) / 180;
    const t = Math.tan(theta);
    return {
      angle: i,
      sinY: 100 - 100 * Math.sin(theta),
      cosY: 100 - 100 * Math.cos(theta),
      tanY: Math.abs(t) > 10 ? null : 100 - 20 * t,
    };
  });

  const isTanUndefined = angle % 180 === 90;

  const sin = -y;
  const cos = x;
  const tan = isTanUndefined ? 'undefined' : (sin / cos).toFixed(3);
  const csc = Math.abs(sin) < 1e-10 ? 'undefined' : (1 / sin).toFixed(3);
  const sec = Math.abs(cos) < 1e-10 ? 'undefined' : (1 / cos).toFixed(3);
  const cot = Math.abs(sin) < 1e-10 ? 'undefined' : (cos / sin).toFixed(3);

  const Graph = ({ stroke, data, lineColor, markerColor, value }) => (
    <svg width="400" height="200" viewBox="0 0 360 200" className="border rounded bg-white">
      <rect x="0" y="0" width="360" height="200" fill="white" />
      <line x1="0" x2="360" y1="100" y2="100" stroke="#ccc" strokeWidth="1" />
      <line x1="0" x2="0" y1="0" y2="200" stroke="#ccc" strokeWidth="1" />
      <text x="5" y="20" fontSize="10" fill="black">1</text>
      <text x="5" y="190" fontSize="10" fill="black">-1</text>
      <polyline fill="none" stroke={stroke} strokeWidth="2" points={data} />
      <line x1={angle} x2={angle} y1="0" y2="200" stroke={lineColor} strokeWidth="1.5" />
      {value !== 'undefined' && <circle cx={angle} cy={value} r="4" fill={markerColor} />}
    </svg>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-white relative">
      <div className="flex flex-col items-center gap-4 p-4 bg-white text-black">
        <h1 className="text-xl font-bold">Interactive Trigonometric System</h1>
        <div className="w-full max-w-md">
          <Slider
            min={0}
            max={360}
            step={1}
            value={[angle]}
            onValueChange={([val]) => setAngle(val)}
          />
          <p className="text-center mt-2">
            Angle: {isEditing ? (
              <input
                type="number"
                min="0"
                max="360"
                value={angle}
                onChange={(e) => setAngle(Math.max(0, Math.min(360, Number(e.target.value))))}
                onBlur={() => setIsEditing(false)}
                autoFocus
                className="w-20 text-center border rounded px-1"
              />
            ) : (
              <span onClick={() => setIsEditing(true)} className="cursor-pointer">
                {usePi ? (piDecimal ? `${(angle / 180).toFixed(2)}π` : simplifyPi(angle)) : `${angle}°`}
              </span>
            )}
            <button onClick={() => setUsePi(!usePi)} className="ml-2 px-2 py-1 border rounded text-sm">{usePi ? '°' : 'π'}</button>
            {usePi && (
              <button onClick={() => setPiDecimal(!piDecimal)} className="ml-2 px-2 py-1 border rounded text-sm">{piDecimal ? 'fraction' : 'decimal'}</button>
            )}
            <button onClick={() => setShowShading(!showShading)} className="ml-2 px-2 py-1 border rounded text-sm">
              {showShading ? 'Hide' : 'Show'} Shading
            </button>
          </p>
        </div>

        <Tabs value={mode} onValueChange={setMode} className="w-full max-w-md">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="sine">Sine</TabsTrigger>
            <TabsTrigger value="cosine">Cosine</TabsTrigger>
            <TabsTrigger value="tangent">Tangent</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
        </Tabs>

        <svg width="300" height="300" viewBox="-1.2 -1.2 2.4 2.4" className="border rounded bg-white">
          {showShading && angle % 90 !== 0 && (
            <path
              d={(() => {
                const startAngles = {
                  A: [0, 90],
                  S: [90, 180],
                  T: [180, 270],
                  C: [270, 360],
                }[quadrant()];
                const [start, end] = startAngles.map(a => (a * Math.PI) / 180);
                const largeArc = end - start > Math.PI ? 1 : 0;
                const x1 = Math.cos(start);
                const y1 = -Math.sin(start);
                const x2 = Math.cos(end);
                const y2 = -Math.sin(end);
                return `M0,0 L${x1},${y1} A1,1 0 ${largeArc} 1 ${x2},${y2} Z`;
              })()}
              fill="#d1d5db"
              opacity="0.5"
            />
          )}
          <circle cx="0" cy="0" r="1" stroke="lightblue" strokeWidth="0.02" fill="none" />
          <line x1="-1.2" x2="1.2" y1="0" y2="0" stroke="black" strokeWidth="0.01" />
          <text x="1.15" y="-0.05" fontSize="0.1" textAnchor="end">x</text>
          <line y1="-1.2" y2="1.2" x1="0" x2="0" stroke="black" strokeWidth="0.01" />
          <text x="-0.05" y="-1.1" fontSize="0.1" textAnchor="end">y</text>
          <line x1="0" y1="0" x2={x} y2={y} stroke="red" strokeWidth="0.03" />
          <text x="0.8" y="0.8" fontSize="0.12" textAnchor="middle">C</text>
          <text x="0.8" y="-0.8" fontSize="0.12" textAnchor="middle">A</text>
          <text x="-0.8" y="-0.8" fontSize="0.12" textAnchor="middle">S</text>
          <text x="-0.8" y="0.8" fontSize="0.12" textAnchor="middle">T</text>
          <circle cx={x} cy={y} r="0.03" fill="red" />
          {showTriangle && angle % 90 !== 0 && (() => {
            const midQuadrant = { A: 45, S: 135, T: 225, C: 315 }[quadrant()];
            const isFirstHalf = angle < midQuadrant;
            const points = isFirstHalf ? `0,0 ${x},0 ${x},${y}` : `0,0 0,${y} ${x},${y}`;
            const reflectPoints =
              (['S', 'C'].includes(quadrant()) && angle !== midQuadrant)
              ? (isFirstHalf ? `0,0 ${x},0 ${x},${y}` : `0,0 0,${y} ${x},${y}`)
              : (isFirstHalf ? `0,0 0,${y} ${x},${y}` : `0,0 ${x},0 ${x},${y}`);
            return (
              <>
                <polygon points={points} fill="#f87171" opacity="0.3" />
                {angle % 90 === 45 && <polygon points={reflectPoints} fill="#f87171" opacity="0.3" />}
              </>
            );
          })()}
        </svg>

        <button onClick={() => setShowTriangle(!showTriangle)} className={`mt-2 px-4 py-1 border rounded text-sm flex items-center gap-1`}>
          Visualise
          <svg className="h-4 w-4" viewBox="0 0 100 100">
            <polygon points="50,15 90,85 10,85" fill={showTriangle ? 'black' : 'none'} stroke="black" strokeWidth="5" />
          </svg>
        </button>

        <div className="flex flex-row flex-wrap justify-center gap-4">
          {(mode === 'sine' || mode === 'all') && (
            <Graph
              stroke="#1D4ED8"
              data={waveData.map(p => `${p.angle},${p.sinY}`).join(' ')}
              lineColor="#DC2626"
              markerColor="#DC2626"
              value={100 - 100 * Math.sin(rad)}
            />
          )}
          {(mode === 'cosine' || mode === 'all') && (
            <Graph
              stroke="#10B981"
              data={waveData.map(p => `${p.angle},${p.cosY}`).join(' ')}
              lineColor="#F59E0B"
              markerColor="#F59E0B"
              value={100 - 100 * Math.cos(rad)}
            />
          )}
          {(mode === 'tangent' || mode === 'all') && (
            <Graph
              stroke="#8B5CF6"
              data={waveData.filter(p => p.tanY !== null).map(p => `${p.angle},${p.tanY}`).join(' ')}
              lineColor="#EC4899"
              markerColor="#EC4899"
              value={isTanUndefined ? 'undefined' : 100 - 20 * Math.tan(rad)}
            />
          )}
        </div>

        <div className="flex items-center gap-2">
          <select value={angleUnit} onChange={(e) => setAngleUnit(e.target.value)} className="px-2 py-1 border rounded text-sm">
            <option value="degree">Degrees (°)</option>
            <option value="radian">Radians (rad)</option>
            <option value="gradian">Gradians (grad)</option>
          </select>
        </div>
        <p className="text-lg">Quadrant: <strong>{(() => {
          const q = quadrant();
          if (angle % 90 === 0 && angle !== 360) {
            const boundaries = { 0: 'A/S', 90: 'A/S', 180: 'S/T', 270: 'T/C', 360: 'C/A' };
            return `${angle}° ∈ ${boundaries[angle]}`;
          }
          return q;
        })()}</strong></p>
        <div className="text-sm grid grid-cols-3 gap-4">
          <div>
            <p>sin(θ) = {sin.toFixed(3)}</p>
            <p>cos(θ) = {cos.toFixed(3)}</p>
            <p>tan(θ) = {tan}</p>
          </div>
          <div>
            <p>csc(θ) = {csc}</p>
            <p>sec(θ) = {sec}</p>
            <p>cot(θ) = {cot}</p>
          </div>
          <div>
            <p><strong>sin(θ)/cos(θ)</strong> = {tan}</p>
            <p><strong>cos(θ)/sin(θ)</strong> = {cot}</p>
            <p><strong>sin²(θ) + cos²(θ)</strong> = {(sin ** 2 + cos ** 2).toFixed(3)}</p>
          </div>
      <div className="fixed bottom-2 right-2 text-sm text-black">
        Note: the visualised triangle at 'C' and 'S' quadrant is flipped.
      </div>
    </div>
  </div>
      <div className="fixed bottom-2 left-2 text-sm text-black">
        Version: 1.12a
      </div>
    </div>
  );
};

function simplifyPi(angle) {
  const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
  const numerator = angle;
  const denominator = 180;
  const common = gcd(numerator, denominator);
  const n = numerator / common;
  const d = denominator / common;
  if (n === 0) return '0';
  if (d === 1) return `${n}π`;
  return `${n}/${d}π`;
}

export default CastUnitCircle;
