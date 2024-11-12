import React, { useState } from 'react';
import { Copy } from 'lucide-react';

const WolframConverter = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const convertWolframExpression = (expression) => {
    let result = expression;

    // 이상한 유니코드 제거
    result = result.replace(//g, '');
    result = result.replace(//g, '');
    result = result.replace(//g, '');
    result = result.replace(//g, '');

    // RowBox 처리
while (result.search(/RowBox\[\{/g) > -1) {
    let oldResult = result;
    result = result.replace(/RowBox\[\{((?:"[^"]+",\s*)*"[^"]+")\}\]/g, 
        (match, contents) => {
            let items = contents.split(',')
                              .map(item => item.trim().replace(/"/g, ''));
            return '"' + items.join(' ') + '"';
        }
    );
    result = result.replace(/SuperscriptBox\["([^"]+)", "([^"]+)"\]/g, '"$1 ^{$2} "');
    result = result.replace(/FractionBox\["([^"]+)", "([^"]+)"\]/g, '"{$1} OVER {$2} "');
    result = result.replace(/SqrtBox\[\"([^"]+)"\]/g, '"SQRT {$1}"');
    if (oldResult === result) break;
}

    // SuperscriptBox 처리
while (result.search(/SuperscriptBox\[/g) > -1) {
    let oldResult = result;
    result = result.replace(/SuperscriptBox\["([^"]+)", "([^"]+)"\]/g, '"$1 ^{$2} "');
    if (oldResult === result) break;
}

    // FractionBox 처리
    result = result.replace(/FractionBox\["([^"]+)", "([^"]+)"\]/g, '"{$1} OVER {$2} "');

    // SqrtBox 처리
while (result.search(/SqrtBox\[/g) >-1) {
    let oldResult = result;
    result = result.replace(/SqrtBox\[\"([^"]+)"\]/g, '"SQRT {$1}"');
    if (oldResult === result) break;
}
    // Equal 처리
    result = result.replace(/\\\:f7d9/g, '=');
    result = result.replace(/\\\[Equal\]/g, '=');

    // FormBox와 TraditionalForm 처리
    result = result.replace(/FormBox\[(.*), TraditionalForm\]/g, '$1');

    // GEQ, LEQ 처리
    result = result.replace(/\\\:2264/g, 'LEQ');
    result = result.replace(/\\\:2265/g, 'GEQ');

    // RowBox 처리
    result = result
      .replace(/RowBox\[\{/g, '')
      .replace(/\}\s*\]/g, '')
      .replace(/[",]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    return result;
  };

  const handleConvert = () => {
    const result = convertWolframExpression(input);
    setOutput(result);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Wolfram 출력값 변환기</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Wolfram 출력값 입력
          </label>
          <textarea
            className="w-full h-[600px] p-6 border rounded-lg font-mono text-lg bg-white"
            style={{
              fontFamily: 'Consolas, Monaco, "Courier New", monospace',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
              fontSize: '18px',
              lineHeight: '1.5'
            }}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="여기에 Wolfram 출력값을 붙여넣으세요..."
          />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700">
              변환 결과
            </label>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
            >
              <Copy className="w-4 h-4" />
              복사하기
            </button>
          </div>
          <textarea
            className="w-full h-[600px] p-6 border rounded-lg bg-gray-50 font-mono text-lg"
            style={{
              fontFamily: 'Consolas, Monaco, "Courier New", monospace',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
              fontSize: '18px',
              lineHeight: '1.5'
            }}
            value={output}
            readOnly
            placeholder="변환된 결과가 여기에 표시됩니다..."
          />
        </div>
      </div>
      <button
        onClick={handleConvert}
        className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
      >
        변환하기
      </button>
    </div>
  );
};

export default WolframConverter;