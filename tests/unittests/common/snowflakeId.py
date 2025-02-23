import unittest
from concurrent.futures import ThreadPoolExecutor
from unittest.mock import patch
from src.common.snowflakeId import SnowflakeGenerator


class TestSnowflakeGenerator(unittest.TestCase):

    def test_01_singleton_pattern(self):
        instance1 = SnowflakeGenerator()
        instance2 = SnowflakeGenerator()
        self.assertIs(instance1, instance2)

    def test_02_sequence_rollover(self):
        worker = SnowflakeGenerator()
        with patch("time.time") as mock_time:
            mock_time.return_value = 1609459200.0
            # Generate maximum sequence numbers
            for _ in range((1 << SnowflakeGenerator.SEQ_BITS) - 1):
                worker.generate()

            # Next call should reset sequence and increment timestamp
            last_id = worker.generate()
            generate = worker.generate()

            last_timestamp = worker.extract_timestamp(last_id)
            next_timestamp = worker.extract_timestamp(generate)
            self.assertEqual(next_timestamp, last_timestamp + 1)
            sequence_mask = (1 << SnowflakeGenerator.SEQ_BITS) - 1
            self.assertEqual(generate & sequence_mask, 0)

    def test_03_timestamp_behavior(self):
        worker = SnowflakeGenerator()
        first_id = worker.generate()
        initial_timestamp = worker.extract_timestamp(first_id)

        # Generate IDs until sequence exhausted
        for _ in range((1 << SnowflakeGenerator.SEQ_BITS) - 1):
            worker.generate()

        # Next ID should increment timestamp
        new_id = worker.generate()
        new_timestamp = worker.extract_timestamp(new_id)
        self.assertEqual(new_timestamp, initial_timestamp + 1)

    def test_04_unique_id_generation(self):
        worker = SnowflakeGenerator()
        ids = [worker.generate() for _ in range(1000)]
        self.assertEqual(len(ids), len(set(ids)))

    def test_05_id_structure(self):
        worker = SnowflakeGenerator()
        snowflake_id = worker.generate()

        # Verify structure using bitmaska
        SEQ_BITS = SnowflakeGenerator.SEQ_BITS
        WORKER_BITS = SnowflakeGenerator.WORKER_BITS

        sequence_mask = (1 << SEQ_BITS) - 1

        sequence = snowflake_id & sequence_mask
        timestamp = snowflake_id >> (SEQ_BITS + WORKER_BITS)

        self.assertLess(sequence, 1 << SEQ_BITS)
        self.assertGreater(timestamp, 0)

    def test_06_concurrent_generation(self):
        worker = SnowflakeGenerator()
        with ThreadPoolExecutor(max_workers=10) as executor:
            futures = [executor.submit(worker.generate) for _ in range(1000)]
            results = [f.result() for f in futures]

        self.assertEqual(len(results), len(set(results)))


if __name__ == "__main__":
    try:
        unittest.main()
    except SystemExit as e:
        print(f"Test result: {e.code}")
