import os
from typing import BinaryIO, Generator, Optional
from pathlib import Path
from .base import StorageBase


class LocalStorage(StorageBase):
    """Local filesystem storage implementation"""

    def __init__(self, root_path: str = "storage"):
        self.root = Path(root_path).absolute()
        self.root.mkdir(parents=True, exist_ok=True)

    def _get_full_path(self, file_path: str) -> Path:
        """Get absolute path with safety checks"""
        full_path = (self.root / file_path).resolve()
        if not str(full_path).startswith(str(self.root)):
            raise ValueError("Invalid file path")
        return full_path

    def upload(self, file_data: BinaryIO, file_path: str) -> str:
        full_path = self._get_full_path(file_path)
        full_path.parent.mkdir(parents=True, exist_ok=True)

        with open(full_path, "wb") as f:
            f.write(file_data.read())

        return str(full_path)

    def download(self, file_path: str) -> BinaryIO:
        full_path = self._get_full_path(file_path)
        return open(full_path, "rb")

    def delete(self, file_path: str) -> bool:
        full_path = self._get_full_path(file_path)
        try:
            full_path.unlink()
            return True
        except FileNotFoundError:
            return False

    def exists(self, file_path: str) -> bool:
        return self._get_full_path(file_path).exists()

    def list_files(self, prefix: str = None) -> Generator[str, None, None]:
        search_path = self.root
        if prefix:
            search_path = self._get_full_path(prefix)

        for root_dir, _, files in os.walk(search_path):
            for f in files:
                file_path = Path(root_dir) / f
                yield str(file_path.relative_to(self.root))

    def get_presigned_url(
        self, file_path: str, expires_in: int = 3600
    ) -> Optional[str]:
        # Not typically implemented for local storage
        return None
