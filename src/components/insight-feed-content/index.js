import React, { useMemo, useEffect, useRef } from 'react';
import './style.scss';

// Prism.js를 클라이언트에서 import
let Prism;
if (typeof window !== 'undefined') {
  Prism = require('prismjs');
  require('prismjs/components/prism-kotlin');
  require('prismjs/components/prism-javascript');
  require('prismjs/components/prism-typescript');
  require('prismjs/components/prism-java');
  require('prismjs/components/prism-python');
  require('prismjs/components/prism-bash');
}

// gatsby-node.js의 MAX_CONTENT_LINES와 동일하게 설정
const MAX_CONTENT_LINES = 20;

// HTML을 파싱해서 20줄 제한 적용
function truncateHtmlContent(html, maxLines = MAX_CONTENT_LINES) {
  if (typeof window === 'undefined') return html;

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const body = doc.body;

  let lineCount = 0;
  const elementsToKeep = [];
  let shouldTruncate = false;

  function traverseNodes(node) {
    if (lineCount >= maxLines) {
      shouldTruncate = true;
      return false; // 중단
    }

    const nodeName = node.nodeName.toLowerCase();

    // 이미지: 1줄로 카운트
    if (nodeName === 'img' || (nodeName === 'p' && node.querySelector('img'))) {
      lineCount++;
      elementsToKeep.push(node.cloneNode(true));
      return lineCount < maxLines;
    }

    // 코드 블록: 실제 라인 수만큼 카운트
    if (nodeName === 'pre') {
      const codeElement = node.querySelector('code');
      if (codeElement) {
        const codeText = codeElement.textContent || '';
        const codeLines = codeText.split('\n').length;
        lineCount += codeLines;

        if (lineCount <= maxLines) {
          // 코드 블록이 제한 내에 있으면 전체 포함 (하이라이팅 유지)
          elementsToKeep.push(node.cloneNode(true));
        } else {
          // 코드 블록이 제한을 초과하면 잘라서 추가
          const linesToInclude = maxLines - (lineCount - codeLines);
          if (linesToInclude > 0) {
            const truncatedLines = codeText.split('\n').slice(0, linesToInclude);
            const clonedNode = node.cloneNode(false); // pre만 복제 (내용 제외)
            const clonedCode = document.createElement('code');

            // 원본 code 요소의 클래스 복사 (language-kotlin 등)
            if (codeElement.className) {
              clonedCode.className = codeElement.className;
            }

            // 잘린 텍스트 설정 (하이라이팅 없이 plain text)
            clonedCode.textContent = truncatedLines.join('\n');
            clonedNode.appendChild(clonedCode);
            elementsToKeep.push(clonedNode);
          }
          shouldTruncate = true;
        }
        return lineCount < maxLines;
      }
    }

    // 일반 텍스트 요소 (p, li, h1-h6 등): 1줄로 카운트
    if (['p', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote'].includes(nodeName)) {
      lineCount++;
      elementsToKeep.push(node.cloneNode(true));
      return lineCount < maxLines;
    }

    // ul, ol 같은 컨테이너는 자식 노드를 순회
    if (['ul', 'ol', 'div'].includes(nodeName)) {
      const containerClone = node.cloneNode(false); // 자식 없이 복제
      const childArray = Array.from(node.childNodes);

      for (let child of childArray) {
        if (!traverseNodes(child)) {
          break; // 제한 도달
        }
        if (child.nodeType === 1) { // Element node
          const lastKept = elementsToKeep[elementsToKeep.length - 1];
          if (lastKept && lastKept.nodeName === child.nodeName) {
            // 방금 추가된 요소를 컨테이너에 넣기
            elementsToKeep.pop();
            containerClone.appendChild(lastKept);
          }
        }
      }

      if (containerClone.childNodes.length > 0) {
        elementsToKeep.push(containerClone);
      }
      return lineCount < maxLines;
    }

    return true;
  }

  // body의 직계 자식들을 순회
  const children = Array.from(body.childNodes);
  for (let child of children) {
    if (child.nodeType === 1) { // Element node만 처리
      if (!traverseNodes(child)) {
        break;
      }
    }
  }

  // 새로운 HTML 생성
  const truncatedContainer = document.createElement('div');
  elementsToKeep.forEach(el => truncatedContainer.appendChild(el));

  return truncatedContainer.innerHTML;
}

function InsightFeedContent({ html, isDetailPage, isTruncated, truncatedHtml }) {
  const shouldTruncate = !isDetailPage && isTruncated;
  const contentRef = useRef(null);

  // 클라이언트 사이드에서 HTML 자르기
  const displayHtml = useMemo(() => {
    if (shouldTruncate) {
      // 1순위: gatsby-node.js에서 생성한 truncatedHtml 사용
      if (truncatedHtml) {
        return truncatedHtml;
      }
      // 2순위: 클라이언트 사이드에서 자르기 (fallback)
      return truncateHtmlContent(html);
    }
    return html;
  }, [html, shouldTruncate, truncatedHtml]);

  // truncation 후 Prism.js 다시 실행
  useEffect(() => {
    if (shouldTruncate && Prism && contentRef.current) {
      // 잘린 코드 블록에만 하이라이팅 재적용
      const codeBlocks = contentRef.current.querySelectorAll('pre code[class*="language-"]');
      codeBlocks.forEach(block => {
        Prism.highlightElement(block);
      });
    }
  }, [displayHtml, shouldTruncate]);

  const contentClass = `post-content ${
    isDetailPage ? 'post-content--detail' : ''
  } ${shouldTruncate ? 'post-content--truncated' : ''}`.trim();

  return (
    <div className={contentClass} ref={contentRef}>
      <div className="markdown" dangerouslySetInnerHTML={{ __html: displayHtml }} />
    </div>
  );
}
export default InsightFeedContent;
