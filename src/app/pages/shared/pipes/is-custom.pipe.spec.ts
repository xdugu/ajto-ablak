import { IsCustomPipe } from './is-custom.pipe';

describe('IsCustomPipe', () => {
  it('create an instance', () => {
    const pipe = new IsCustomPipe();
    expect(pipe).toBeTruthy();
  });
});
