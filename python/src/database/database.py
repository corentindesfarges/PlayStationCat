
import datetime

from src.database.sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean
from src.database.sqlalchemy.orm import relationship, backref
from src.database.sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Comment(Base):

    __tablename__ = 'comment'
    id = Column(Integer, primary_key=True, autoincrement=True)
    comment = Column(String)
    date = Column(DataTime, onupdate=datetime.datetime.now)

    def to_json(self):
    	return {
				'id':self.id,
				'comment':self.comment,
				'data':self.date}

engine = create_engine('/src/database/database.db')
db_session = scoped_session(
	sessionmaker(autocommit=False,
	autoflush=False,
	bind=engine))
Base.metadata.create_all(engine) 

def init_db():
	Base.metadata.create_all(bind=engine)
	