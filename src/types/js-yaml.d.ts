declare module 'js-yaml' {
  namespace jsYaml {
    function load(str: string): any;
    function dump(obj: any): string;
    function safeLoad(str: string): any;
    function safeDump(obj: any): string;
  }
  export = jsYaml;
}
