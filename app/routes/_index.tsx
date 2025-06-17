import { useState, useEffect } from 'react';
import { e } from 'vite-node/dist/index.d-DGmxD2U7.js';

export default function App() {
  const [tvCount, setTvCount] = useState(0);
  const [equipmentType, setEquipmentType] = useState('tvG');
  const [settopType, setSettopType] = useState('UHD4');
  const [isCalculated, setIsCalculated] = useState(false);
  const [result, setResult] = useState({ total: 0, withTax: 0, lineCount: 0, linePrice: 0, equipmentPrice: 0, settopPrice: 0 });
  
  // 계산 로직
  const calculatePrice = () => {
    if (tvCount <= 0) return { total: 0, withTax: 0, lineCount: 0, linePrice: 0, equipmentPrice: 0, settopPrice: 0 };
    
    // 회선 수 = TV 수 / 8 (올림)
    const lineCount = Math.ceil(tvCount / 8);
    const linePrice = lineCount * 35000;
    
    // 장비 임대료
    const equipmentPrice = tvCount * 5900; // tvG만 있음
    
    // 셋탑 임대료
    let settopPrice = 0;
    if (settopType === 'UHD4') {
      // TV 수가 50개 넘으면 면제
      settopPrice = tvCount > 50 ? 0 : tvCount * 1500;
    } else if (settopType === 'hd고급형') {
      settopPrice = 0; // 무료
    }
    
    const total = equipmentPrice + settopPrice + linePrice;
    const withTax = Math.floor(total * 1.1);
    
    return { total, withTax, lineCount, linePrice, equipmentPrice, settopPrice };
  };
  
  // 계산하기 버튼 클릭 핸들러
  const handleCalculate = () => {
    const calculatedResult = calculatePrice();
    setResult(calculatedResult);
    setIsCalculated(true);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            아도나이x티비넷 인터넷 요금 계산기 (유플러스)
          </h1>
          <p className="text-gray-600">
            필요하신 TV 수량과 옵션을 선택하여 월 요금을 계산해보세요
          </p>
        </div>
        
        {/* 메인 폼 */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          {/* TV 수 입력 */}
          <div className="mb-8">
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              TV 대수
            </label>
            <input
              type="number"
              min="0"
              value={tvCount || ''}
              onChange={(e) => setTvCount(parseInt(e.target.value) || 0)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleCalculate();
                }
              }}
              placeholder="TV 대수를 입력하세요"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-lg"
            />
          </div>
          
          {/* 장비 임대료 */}
          <div className="mb-8">
            <label className="block text-lg font-semibold text-gray-700 mb-4">
               장비 임대료
            </label>
            <div className="space-y-3">
              <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors">
                <input
                  type="radio"
                  name="equipment"
                  value="tvG"
                  checked={equipmentType === 'tvG'}
                  onChange={(e) => setEquipmentType(e.target.value)}
                  className="w-5 h-5 text-blue-600 mr-3"
                />
                <div>
                  <div className="font-medium text-gray-800">일반형 tvG</div>
                  <div className="text-sm text-gray-600">TV 당 5,900원</div>
                </div>
              </label>
            </div>
          </div>
          
          {/* 셋탑 임대료 */}
          <div className="mb-8">
            <label className="block text-lg font-semibold text-gray-700 mb-4">
              셋탑 임대료
            </label>
            <div className="space-y-3">
              <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors">
                <input
                  type="radio"
                  name="settop"
                  value="UHD4"
                  checked={settopType === 'UHD4'}
                  onChange={(e) => setSettopType(e.target.value)}
                  className="w-5 h-5 text-blue-600 mr-3"
                />
                <div>
                  <div className="font-medium text-gray-800">UHD4</div>
                  <div className="text-sm text-gray-600">
                    1,500원 <span className="text-green-600 font-semibold">(50개 초과시 면제)</span>
                  </div>
                </div>
              </label>
              
              <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors">
                <input
                  type="radio"
                  name="settop"
                  value="hd고급형"
                  checked={settopType === 'hd고급형'}
                  onChange={(e) => setSettopType(e.target.value)}
                  className="w-5 h-5 text-blue-600 mr-3"
                />
                <div>
                  <div className="font-medium text-gray-800">hd고급형</div>
                  <div className="text-sm text-gray-600">무료 (0원)</div>
                </div>
              </label>
            </div>
          </div>
          
           {/* 부가서비스 */}
          <div className="mb-8">
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              부가서비스
            </label>
            <div className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-base font-medium text-gray-800">
              <>
              와이파이 무상 제공<br />
              성인방송 비키 무상 제공
              </>
            </div>
          </div>

          {/* 계산하기 버튼 */}
          <div className="text-center">
            <button
              onClick={handleCalculate}
              disabled={tvCount <= 0}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
               계산하기
            </button>
          </div>
          
          {/* 계산 상세 내역 */}
          {isCalculated && tvCount > 0 && (
            <div className="bg-gray-50 rounded-lg p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4"> 계산 내역</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>회선 수 (셋탑박스 8대당 1회선 과금)</span>
                  <span>{result.lineCount}회선</span>
                </div>
                <div className="flex justify-between">
                  <span>회선 요금 ({result.lineCount}회선 × 35,000원)</span>
                  <span>{result.linePrice.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between">
                  <span>장비 임대료 ({tvCount}개 × 5,900원)</span>
                  <span>{result.equipmentPrice.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between">
                  <span>셋탑 임대료 ({tvCount}개 × {result.settopPrice/tvCount}원)</span>
                  <span>{result.settopPrice.toLocaleString()}원</span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* 결과 표시 */}
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          {isCalculated ? (
            <div className="mb-4">
              <div className="text-xl font-bold text-gray-800 mb-2">
                 Room 당 요금: {Math.round(result.total / tvCount).toLocaleString()}원
              </div>
              <div className="text-xl font-bold text-gray-800 mb-2">
                 Room 당 요금(vat 포함):  {Math.round(result.withTax / tvCount).toLocaleString()}원 
              </div>
              <div className="text-2xl font-bold text-gray-800 mb-2">
                 총 요금: {result.total.toLocaleString()}원
              </div>
              <div className="text-2xl font-semibold text-blue-600">
                 총 요금(vat 포함): {result.withTax.toLocaleString()}원
              </div>
              <div className="text-center mt-8 text-gray-500 text-sm">
                <p>※ 상기 금액은 월 요금 기준이며, 더 많은 혜택과 자세한 상담을 원하실 시 연락주세요.</p>
              </div>
            </div>
          ) : (
            <div className="mb-4">
              <div className="text-2xl font-bold text-gray-400 mb-2">
                 총 요금: - 원
              </div>
              <div className="text-xl font-semibold text-gray-400">
                 부가세포함: - 원
              </div>
            </div>
          )}
          
          {!isCalculated && (
            <p className="text-gray-500 text-sm">
              TV 수량과 옵션을 선택한 후 계산하기 버튼을 눌러주세요
            </p>
          )}
        </div>
        
        {/* 푸터 */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>아도나이x티비넷</p>
        </div>
      </div>
    </div>
  );
}