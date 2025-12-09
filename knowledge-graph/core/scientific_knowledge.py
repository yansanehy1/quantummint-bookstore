# knowledge-graph/scientific_knowledge.py
from neo4j import GraphDatabase
import os

class ScientificKnowledgeGraph:
    def __init__(self, uri=None, user=None, password=None):
        self.uri = uri or os.getenv('NEO4J_URL', 'bolt://neo4j:7687')
        self.user = user or os.getenv('NEO4J_USER', 'neo4j')
        self.password = password or os.getenv('NEO4J_PASSWORD', 'password')
        
        try:
            self.driver = GraphDatabase.driver(self.uri, auth=(self.user, self.password))
            print(f"Connected to Neo4j at {self.uri}")
        except Exception as e:
            print(f"Failed to connect to Neo4j: {e}")
            self.driver = None
            
    def close(self):
        if self.driver:
            self.driver.close()
            
    def find_related_concepts(self, concept):
        """Find related concepts in knowledge graph"""
        if not self.driver:
            return []
            
        with self.driver.session() as session:
            result = session.run(
                """
                MATCH (c:Concept {name: $concept})-[r:RELATES_TO]-(related)
                RETURN related.name as name, type(r) as relationship
                LIMIT 5
                """,
                concept=concept
            )
            return [{"name": record["name"], "relationship": record["relationship"]} for record in result]
