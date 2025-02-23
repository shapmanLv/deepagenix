import time
from threading import Thread
from src.common.snowflakeId import SnowflakeGenerator


class SnowflakeBenchmark:
    def __init__(self):
        self.generator = SnowflakeGenerator()
        self.results = []

    def _test_case(self, case_name, iterations):
        start = time.perf_counter()
        for _ in range(iterations):
            self.generator.generate()
        cost = (time.perf_counter() - start) * 1000  # 毫秒
        self.results.append(
            {
                "测试场景": case_name,
                "生成数量": iterations,
                "总耗时(ms)": round(cost, 2),
                "单ID耗时(ns)": round(cost * 1e6 / iterations, 2),
            }
        )

    def run(self):
        # 单线程测试
        self._test_case("单线程生成1个ID", 1)
        self._test_case("单线程生成100个ID", 100)
        self._test_case("单线程生成10,000个ID", 10_000)

        # 多线程测试
        def multi_thread_task():
            for _ in range(1000):
                self.generator.generate()

        threads = [Thread(target=multi_thread_task) for _ in range(50)]
        start = time.perf_counter()
        [t.start() for t in threads]
        [t.join() for t in threads]
        cost = (time.perf_counter() - start) * 1000
        self.results.append(
            {
                "测试场景": "50线程各生成1,000ID",
                "生成数量": 50_000,
                "总耗时(ms)": round(cost, 2),
                "单ID耗时(ns)": round(cost * 1e6 / 50_000, 2),
            }
        )

        # 控制台表格输出
        print("\n🔥 性能测试结果")
        print(f"{'场景':<20} | {'数量':>8} | {'总耗时(ms)':>10} | {'单ID耗时(ns)':>12}")
        print("-" * 60)
        for r in self.results:
            print(
                f"{r['测试场景']:<20} | {r['生成数量']:>8,} | {r['总耗时(ms)']:>10.2f} | {r['单ID耗时(ns)']:>12.2f}"
            )


if __name__ == "__main__":
    SnowflakeBenchmark().run()
