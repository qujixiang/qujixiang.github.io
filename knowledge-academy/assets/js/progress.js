/**
 * 学习进度：用 localStorage 记录章节完成状态。
 * 键格式：ka:<subject>:<chapterId>，值为完成时间戳。
 */
(function (global) {
  const PREFIX = 'ka';

  function key(subject, chapterId) {
    return `${PREFIX}:${subject}:${chapterId}`;
  }

  function markDone(subject, chapterId) {
    try {
      localStorage.setItem(key(subject, chapterId), String(Date.now()));
    } catch (e) {
      /* 隐私模式下 localStorage 可能不可用，静默降级 */
    }
  }

  function unmark(subject, chapterId) {
    try {
      localStorage.removeItem(key(subject, chapterId));
    } catch (e) {
      /* 同上 */
    }
  }

  function isDone(subject, chapterId) {
    try {
      return localStorage.getItem(key(subject, chapterId)) !== null;
    } catch (e) {
      return false;
    }
  }

  /**
   * 统计完成数量。
   * @param {string} subject 科目名
   * @param {string[]} chapterIds 全部章节 ID
   * @returns {{done: number, total: number, percent: number}}
   */
  function summary(subject, chapterIds) {
    const done = chapterIds.filter((id) => isDone(subject, id)).length;
    const total = chapterIds.length;
    return { done, total, percent: total === 0 ? 0 : Math.round((done / total) * 100) };
  }

  /** 绑定章节页底部的「标记完成」按钮 */
  function bindCompleteButton(subject, chapterId) {
    const btn = document.getElementById('mark-complete');
    const status = document.getElementById('complete-status');
    if (!btn) return;

    const refresh = () => {
      const done = isDone(subject, chapterId);
      btn.classList.toggle('is-done', done);
      btn.textContent = done ? '✓ 已完成' : '标记本章完成';
      if (status) {
        status.textContent = done ? '已记录学习进度' : '学完记得标记，方便下次继续';
      }
    };

    btn.addEventListener('click', () => {
      if (isDone(subject, chapterId)) {
        unmark(subject, chapterId);
      } else {
        markDone(subject, chapterId);
      }
      refresh();
    });

    refresh();
  }

  /** 在目录页给每个章节条目加上完成标记 */
  function decorateToc(subject, chapterIds) {
    chapterIds.forEach((id) => {
      const el = document.querySelector(`[data-chapter="${id}"]`);
      if (el) el.classList.toggle('is-done', isDone(subject, id));
    });

    const bar = document.getElementById('overall-progress');
    const text = document.getElementById('overall-progress-text');
    if (bar) {
      const s = summary(subject, chapterIds);
      bar.style.width = s.percent + '%';
      if (text) text.textContent = `已完成 ${s.done} / ${s.total} 章`;
    }
  }

  global.KAProgress = { markDone, unmark, isDone, summary, bindCompleteButton, decorateToc };
})(window);
