import preval from "next-plugin-preval";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "../../tailwind.config";

const fullConfig = resolveConfig(tailwindConfig);

export default preval(fullConfig);
