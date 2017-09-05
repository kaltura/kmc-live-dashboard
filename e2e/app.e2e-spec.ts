import { LiveDashboardPage } from './app.po';

describe('live-dashboard App', () => {
  let page: LiveDashboardPage;

  beforeEach(() => {
    page = new LiveDashboardPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
