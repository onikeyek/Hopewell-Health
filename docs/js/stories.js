// Map story IDs to their detail pages
const STORY_PAGES = {
  3: 'story-water-initiative.html',
};

function getStoryLink(story) {
  return STORY_PAGES[story.id] || '#';
}

async function initStories() {
  try {
    const stories = await apiFetch('/stories');
    renderStories(stories);
  } catch (err) {
    document.getElementById('storiesList').innerHTML =
      '<div class="error-state">⚠ Could not load stories. Is the server running?</div>';
  }
}

function renderStories(stories) {
  const container = document.getElementById('storiesList');

  container.innerHTML = stories.map((story, i) => {
    const isReverse = i % 2 !== 0;
    const hasHighlight = story.stat1_value && story.stat1_label.toLowerCase().includes('reduction');

    return `
      <article class="story-card ${isReverse ? 'reverse' : ''}">
        <div class="story-content">
          <div class="story-category">${story.category.toUpperCase()}</div>
          <h2>${story.title}</h2>
          <p>${story.body}</p>
          ${hasHighlight
            ? `<div class="story-highlight">${story.stat1_value} ${story.stat1_label}</div>`
            : `<div class="story-stats">
                <div class="story-stat-item">
                  <div class="story-stat-num">${story.stat1_value}</div>
                  <div class="story-stat-lbl">${story.stat1_label}</div>
                </div>
                <div class="story-stat-item">
                  <div class="story-stat-num">${story.stat2_value}</div>
                  <div class="story-stat-lbl">${story.stat2_label}</div>
                </div>
              </div>`
          }
          <a href="${getStoryLink(story)}" class="story-read-link">READ FULL STORY →</a>
        </div>
        <div class="story-image">
          <img src="${story.image}" alt="${story.image_alt}" loading="lazy" />
        </div>
      </article>
    `;
  }).join('');
}

document.addEventListener('DOMContentLoaded', initStories);
