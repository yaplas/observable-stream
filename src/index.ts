import { controlledPipe } from "./pipe";
import { toObservable } from "./observable";

export { controlledPipe, toObservable };

// this is just for backwards compatibility
// by mistake the first versions exports functions like this
export default { controlledPipe, toObservable };
