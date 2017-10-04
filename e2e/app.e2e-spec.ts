import { WhoToFollowPage } from './app.po';

describe('who-to-follow App', () => {
  let page: WhoToFollowPage;

  beforeEach(() => {
    page = new WhoToFollowPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
