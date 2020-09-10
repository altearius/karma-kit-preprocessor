# karma-kit-preprocessor

Preprocessor for [Karma](https://karma-runner.github.io/) to compile
[Kit](https://codekitapp.com/help/kit/) files on the fly. Useful for
providing kit-based test fixtures.

Upon loading a target kit file, Karma will compile the kit file using the
[node-kit](https://www.npmjs.com/package/node-kit) compiler, processing any
variables and import declarations found within. Additionally, Karma will watch
the kit files for changes.

## Installation

```bash
yarn add karma-kit-preprocessor --dev
```
or
```bash
npm install karma-kit-preprocessor --save-dev
```

## Configuration

Associate the preprocessor with kit files in your `karma.conf.js`, and instruct
Karma to serve kit files:

```js
// karma.conf.js
module.exports = function (config) {
  config.set({
    files: [
      {
        // Allow loading kit files.
        pattern: "**/*.kit",
        served: true,
        included: false
      }
    ],

    preprocessors: {
      // Compile kit files on the fly.
      "**/*.kit": ["karma-kit-preprocessor"]
    }
  });
};
```

## Usage

Provide a basic test fixture:

```ts
class TestFixture {
  protected _element: Element | null = null;
  private _html: string = "";

  public constructor(private readonly _endpoint: string) {}

  public async init(): Promise<void> {
    this._html = await (await fetch(this._endpoint)).text();
  }

  public prepare(): void {
    this.teardown();
    this._element = document.createElement("div");
    this._element.innerHTML = this._html;
    document.body.appendChild(this._element);
  }

  public teardown(): void {
    const el = this._element;
    this._element = null;
    el?.remove();
  }

  public getElement(): Element {
    const el = this._element?.firstElementChild;

    if (!el) {
      throw new Error("Unexpected fixture");
    }

    return el;
  }
}
```

Write tests that use the fixture:

```ts
import { MyComponent } from "./MyComponent";
import { TestFixture } from "./TestFixture";

describe("my component", () => {
  const fixture = new TestFixture("/base/_component.kit");
  beforeAll(() => fixture.init());
  beforeEach(() => fixture.prepare());
  afterEach(() => fixture.teardown());

  it("can fizzbuzz", () => {
    // Arrange
    const component = new MyComponent(fixture.element);

    // Act
    const actual = component.canFizzBuzz();

    // Assert
    expect(actual).toBeTrue();
  });
});
```
