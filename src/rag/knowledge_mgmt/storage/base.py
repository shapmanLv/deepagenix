from abc import ABC, abstractmethod
from typing import BinaryIO, Optional, Generator

class StorageBase(ABC):
    """Abstract base class for file storage operations"""
    
    @abstractmethod
    def upload(self, file_data: BinaryIO, file_path: str) -> str:
        """Store file data and return storage URI
        Args:
            file_data: Binary file-like object
            file_path: Destination path including filename
        Returns:
            Storage URI for accessing the file
        """
        pass

    @abstractmethod
    def download(self, file_path: str) -> BinaryIO:
        """Retrieve file data
        Args:
            file_path: Full path to stored file
        Returns:
            File-like object containing the data
        """
        pass

    @abstractmethod
    def delete(self, file_path: str) -> bool:
        """Permanently remove a file
        Args:
            file_path: Full path to stored file
        Returns:
            True if deletion succeeded
        """
        pass

    @abstractmethod
    def exists(self, file_path: str) -> bool:
        """Check if a file exists
        Args:
            file_path: Full path to check
        """
        pass

    @abstractmethod
    def list_files(self, prefix: str = None) -> Generator[str, None, None]:
        """List available files
        Args:
            prefix: Path prefix to filter results
        Yields:
            File paths matching the criteria
        """
        pass

    @abstractmethod
    def get_presigned_url(self, file_path: str, expires_in: int = 3600) -> Optional[str]:
        """Generate temporary access URL
        Args:
            file_path: Path to stored file
            expires_in: URL validity in seconds
        Returns:
            Presigned URL or None if not supported
        """
        pass
