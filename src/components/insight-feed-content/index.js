import React, { useMemo } from 'react';
import './style.scss';

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
          elementsToKeep.push(node.cloneNode(true));
        } else {
          // 코드 블록이 제한을 초과하면 잘라서 추가
          const linesToInclude = maxLines - (lineCount - codeLines);
          if (linesToInclude > 0) {
            const truncatedLines = codeText.split('\n').slice(0, linesToInclude);
            const clonedNode = node.cloneNode(true);
            const clonedCode = clonedNode.querySelector('code');
            if (clonedCode) {
              clonedCode.textContent = truncatedLines.join('\n');
            }
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

function InsightFeedContent({ html, isDetailPage, isTruncated }) {
  const shouldTruncate = !isDetailPage && isTruncated;

  // 클라이언트 사이드에서 HTML 자르기
  const displayHtml = useMemo(() => {
    if (shouldTruncate) {
      return truncateHtmlContent(html);
    }
    return html;
  }, [html, shouldTruncate]);

  return (
    <div className={`post-content ${shouldTruncate ? 'post-content--truncated' : ''}`}>
      <div className="markdown" dangerouslySetInnerHTML={{ __html: displayHtml }} />
    </div>
  );
}
export default InsightFeedContent;
