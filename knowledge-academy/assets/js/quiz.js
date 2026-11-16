/**
 * 通用测验组件：数据驱动，逐题作答、即时反馈、最后给分。
 *
 * 题目结构：
 * { question: string, options: string[], answer: number, explain: string }
 */
(function (global) {
  function initQuiz(root, questions) {
    if (!root || !questions || !questions.length) return;

    let current = 0;
    let score = 0;

    const metaEl = root.querySelector('.quiz__meta');
    const progressEl = root.querySelector('.quiz__progress');
    const questionEl = root.querySelector('.quiz__question');
    const optionsEl = root.querySelector('.quiz__options');
    const feedbackEl = root.querySelector('.quiz__feedback');
    const nextBtn = root.querySelector('.quiz__next');
    const resultEl = root.querySelector('.quiz__result');

    function render() {
      const q = questions[current];
      progressEl.textContent = `第 ${current + 1} / ${questions.length} 题`;
      questionEl.textContent = q.question;
      optionsEl.innerHTML = '';
      feedbackEl.className = 'quiz__feedback';
      feedbackEl.textContent = '';
      nextBtn.classList.remove('is-visible');

      q.options.forEach((text, index) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'quiz__option';
        btn.textContent = text;
        btn.addEventListener('click', () => choose(index));
        optionsEl.appendChild(btn);
      });
    }

    function choose(index) {
      const q = questions[current];
      const buttons = Array.from(optionsEl.querySelectorAll('.quiz__option'));
      buttons.forEach((btn, i) => {
        btn.disabled = true;
        if (i === q.answer) btn.classList.add('is-correct');
        if (i === index && index !== q.answer) btn.classList.add('is-wrong');
      });

      const correct = index === q.answer;
      if (correct) score += 1;

      feedbackEl.textContent = (correct ? '答对了。' : '不对。') + q.explain;
      feedbackEl.className = 'quiz__feedback is-visible ' + (correct ? 'is-correct' : 'is-wrong');

      if (current < questions.length - 1) {
        nextBtn.textContent = '下一题 →';
        nextBtn.classList.add('is-visible');
      } else {
        nextBtn.textContent = '查看结果';
        nextBtn.classList.add('is-visible');
      }
    }

    function next() {
      if (current < questions.length - 1) {
        current += 1;
        render();
        return;
      }
      showResult();
    }

    function showResult() {
      metaEl.style.display = 'none';
      questionEl.style.display = 'none';
      optionsEl.style.display = 'none';
      feedbackEl.style.display = 'none';
      nextBtn.style.display = 'none';

      const percent = Math.round((score / questions.length) * 100);
      let comment = '建议回头再看一遍本章的核心概念。';
      if (percent === 100) comment = '全对。这一章你已经掌握了。';
      else if (percent >= 60) comment = '基本掌握，可以进入下一章了。';

      resultEl.innerHTML = `
        <div class="quiz__score">${score} / ${questions.length}</div>
        <p style="color: var(--ink-500); margin-top: var(--space-2);">${comment}</p>
      `;
      resultEl.classList.add('is-visible');
    }

    nextBtn.addEventListener('click', next);
    render();
  }

  global.KAQuiz = { initQuiz };
})(window);
