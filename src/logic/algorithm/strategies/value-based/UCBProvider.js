import { UCB_C } from "@/Constants.js";

class UcbCProvider {
    getC(step, total) {
        void step; void total;
        return UCB_C;
    }
}
export default new UcbCProvider();
