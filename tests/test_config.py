import os
import unittest
from src.common.config import get_config

class TestConfigLoader(unittest.TestCase):
    def setUp(self):
        self.original_env = os.environ.copy()
        os.environ.pop('APP_ENV', None)
        
    def tearDown(self):
        os.environ = self.original_env

    def test_base_config_values(self):
        """测试基础配置文件值"""
        os.environ['APP_ENV'] = 'NONE'
        config = get_config(refresh=True)
        
        # 验证base.yaml中的配置
        self.assertEqual(config['database']['host'], 'localhost')
        self.assertEqual(config['database']['port'], 5432)
        self.assertEqual(config['logging']['level'], 'INFO')
        self.assertEqual(config['cache']['type'], 'memory')

    def test_environment_override(self):
        """测试环境变量覆盖配置"""
        # 设置环境变量（使用下划线格式）
        os.environ['database__host'] = 'env.host'
        os.environ['logging__level'] = 'TRACE'
        os.environ['cache__type'] = 'redis'
        
        config = get_config(refresh=True)
        
        # 验证环境变量覆盖
        self.assertEqual(config['database']['host'], 'env.host')
        self.assertEqual(config['logging']['level'], 'TRACE')
        self.assertEqual(config['cache']['type'], 'redis')

    def test_missing_config_returns_none(self):
        """测试不存在的配置返回None"""
        config = get_config()
        self.assertIsNone(config.get('non_exist_section'))
        self.assertIsNone(config['database'].get('non_exist_key'))

    def test_config_structure(self):
        """验证配置结构完整性"""
        config = get_config()
        
        # 检查必要配置节
        required_sections = ['database', 'logging', 'cache', 'security']
        for section in required_sections:
            self.assertIn(section, config)
            
        # 检查数据库配置项
        self.assertIn('pool_size', config['database'])

if __name__ == '__main__':
    try:
        unittest.main()
    except SystemExit as e:
        print(f"Test result: {e.code}")
