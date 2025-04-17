from chat_bi.datasource.factory import DataSourceProviderFactory, DataSourceType


def _datasource_pressure_test(thread_count=20, loop_per_thread=5):
    import asyncio
    from concurrent.futures import ThreadPoolExecutor
    import os
    import threading
    import time
    import psutil
    
    """数据源压测方法
    :param thread_count: 并发线程数，默认20
    :param loop_per_thread: 每线程循环次数，默认5
    """
    # region 内部函数定义
    def _get_memory_usage():
        """获取进程内存使用(MB)"""
        process = psutil.Process(os.getpid())
        return process.memory_info().rss / 1024 / 1024

    async def _async_main():
        """异步任务主逻辑"""
        start_mem = _get_memory_usage()
        
        async with await DataSourceProviderFactory().create_provider(
            type=DataSourceType.MSSQL,
            connection_setting={
                "database": "test",
                "username": "sa",
                "password": "123456Abc",
                "host": "localhost",
                "extra_params": {"trustServerCertificate": "yes"},
            },
        ) as provider: 
            connection_result = await provider.connection_testing()
            print(f"数据库连接状态：{'【成功】' if connection_result.is_connection else '【失败】'}")
            tables = await provider.tables()
            
            # 并发获取所有表字段
            tasks = [
                provider.fields(
                    tablename=table.name,
                    schema=table.schema or "",
                    type=table.type,
                )
                for table in tables
            ]
            await asyncio.gather(*tasks)

        end_mem = _get_memory_usage()
        print(f"内存变化: {end_mem - start_mem:.2f}MB | 线程ID: {threading.get_ident()}")

    def _thread_main():
        """线程入口函数"""
        for _ in range(loop_per_thread):
            try:
                asyncio.run(_async_main())
            except Exception as e:
                print(f"线程{threading.get_ident()}异常: {str(e)}")
    # endregion

    # region 压测执行
    print("=== 压测开始 ===")
    start_time = time.time()

    with ThreadPoolExecutor(max_workers=thread_count) as executor:
        futures = [executor.submit(_thread_main) for _ in range(thread_count)]
        for future in futures:
            future.result()  # 等待所有线程完成

    # 结果统计
    duration = time.time() - start_time
    print("\n=== 压测完成 ===")
    print(f"总线程数: {thread_count} | 每线程循环: {loop_per_thread}")
    print(f"总请求数: {thread_count * loop_per_thread}")
    print(f"耗时: {duration:.2f}秒")
    # endregion

if __name__ == "__main__":
    #  asyncio.run(main=main())
    # 压测数据源
    _datasource_pressure_test()
