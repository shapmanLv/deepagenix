import os
import yaml
from pathlib import Path
from typing import Any, Dict, List


class ConfigLoader:
    _instance = None
    _config: Dict[str, Any] = {}

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(ConfigLoader, cls).__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        if not self._initialized:
            self.base_path = Path(__file__).parent.parent.parent / "config"
            self._load_config()
            self._initialized = True

    def _load_config(self):
        # 加载基础配置
        base_config = self._load_yaml(self.base_path / "base.yaml")

        # 获取当前环境并加载环境相关的配置
        env = os.getenv("APP_ENV", "development")
        env_file_path = self.base_path / f"{env}.yaml"
        env_config = self._load_yaml(env_file_path) if env_file_path.exists() else {}

        # 合并基础配置和环境配置
        self._config = self._deep_merge(base_config, env_config)

        # 处理环境变量
        self._apply_environment_variables()

    def _load_yaml(self, path: Path) -> Dict:
        if not path.exists():
            raise FileNotFoundError(f"Config file {path} not found")

        with open(path, "r") as f:
            return yaml.safe_load(f) or {}

    def _deep_merge(self, base: Dict, update: Dict) -> Dict:
        """递归合并字典，更新基础字典的内容"""
        for key, value in update.items():
            if isinstance(value, dict):
                base[key] = self._deep_merge(base.get(key, {}), value)
            elif isinstance(value, list):
                # 合并列表时追加元素
                base_list = base.get(key, [])
                if isinstance(base_list, list):
                    base_list.extend(value)
                    base[key] = base_list
                else:
                    base[key] = value
            else:
                base[key] = value
        return base

    def _flatten_dict(self, d: Dict, sep, parent_key=""):
        """
        将嵌套字典扁平化，`sep` 用于连接键值
        """
        items = []
        for k, v in d.items():
            new_key = f"{parent_key}{sep}{k}" if parent_key else k
            if isinstance(v, dict):
                items.extend(self._flatten_dict(v, sep=sep, parent_key=new_key).items())
            else:
                items.append((new_key, v))
        return dict(items)

    def _dict_key_to_strs(self, d: Dict, sep="__") -> List[str]:
        """
        把字典key进行扁平化，用`sep`拼接成字符串然后全部返回
        """
        flattened = self._flatten_dict(d, sep=sep)
        return [key for key, value in flattened.items()]

    def _set_config_value(self, key: str, sep: str, value: Any):
        keys = key.split(sep)  # 使用 `sep` 分割键
        current_dict = self._config

        # 遍历键并为每个部分创建必要的嵌套字典
        for part in keys[:-1]:  # 处理除了最后一部分的键
            if part not in current_dict:
                current_dict[part] = {}  # 如果字典不存在，创建一个空字典
            current_dict = current_dict[part]

        # 设置最终的键值对
        current_dict[keys[-1]] = value

    def _apply_environment_variables(self):
        """应用环境变量替换配置中的占位符"""
        sep = "__"
        keys = self._dict_key_to_strs(self._config, sep=sep)
        for key in keys:
            if value := os.getenv(key):
                self._set_config_value(key, sep, self._parse_env_value(value))

    def _parse_env_value(self, value: str):
        """尝试解析环境变量值，如果无法解析，则返回原值"""
        try:
            return yaml.safe_load(value)
        except yaml.YAMLError:
            return value

    @property
    def config(self) -> Dict:
        return self._config


# 配置加载器实例
_config_loader = ConfigLoader()


def get_config(refresh: bool = False) -> Dict[str, Any]:
    global _config_loader
    if refresh:
        # 重新创建实例
        ConfigLoader._instance = None  # 重置掉原有的
        _config_loader = ConfigLoader()  # 然后再生成新的
    return _config_loader.config
