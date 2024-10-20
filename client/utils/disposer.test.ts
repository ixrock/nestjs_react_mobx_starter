import { Disposer, disposer } from "./disposer";

describe("Disposer helper utility", () => {
  let dispose: Disposer;
  let someAction: jest.Mock;
  let someAction2: jest.Mock;

  beforeEach(() => {
    someAction = jest.fn();
    someAction2 = jest.fn();
    dispose = disposer(someAction);
  });

  it("once 'disposed' calling additional times has no effect", () => {
    dispose();
    dispose();
    dispose();
    expect(someAction).toHaveBeenCalledTimes(1);
  });

  it("allows to dispose all listeners at once", () => {
    const someAction3 = jest.fn();
    dispose.push(someAction2, someAction2, someAction3, someAction3, someAction3);
    dispose();
    expect(someAction).toHaveBeenCalledTimes(1);
    expect(someAction2).toHaveBeenCalledTimes(2);
    expect(someAction3).toHaveBeenCalledTimes(3);
  });
});
