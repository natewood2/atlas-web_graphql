const _ = require('lodash');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLID,
  GraphQLList
} = require('graphql');

const Task = require('../models/task');
const Project = require('../models/project');

const TaskType = new GraphQLObjectType({
  name: 'Task',
  fields: () => ({
    id: { type: GraphQLString },
    title: { type: GraphQLString },
    weight: { type: GraphQLInt },
    description: { type: GraphQLString },
    project: {
      type: ProjectType,
      resolve(parent, args) {
        return Project.findById(parent.projectId);
      }
    }
  })
});

const ProjectType = new GraphQLObjectType({
  name: 'Project',
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    weight: { type: GraphQLInt },
    description: { type: GraphQLString },
    tasks: {
      type: new GraphQLList(TaskType),
      resolve(parent, args) {
        return Task.find({ projectId: parent.id });
      }
    }
  })
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    task: {
      type: TaskType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Task.findById(args.id);
      }
    },
    tasks: {
      type: new GraphQLList(TaskType),
      resolve() {
        return Task.find({});
      }
    },
    project: {
      type: ProjectType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Project.findById(args.id);
      }
    },
    projects: {
      type: new GraphQLList(ProjectType),
      resolve() {
        return Project.find({});
      }
    }
  }
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addTask: {
      type: TaskType,
      args: {
        title: { type: GraphQLString },
        weight: { type: GraphQLInt },
        description: { type: GraphQLString },
        projectId: { type: GraphQLID }
      },
      resolve(parent, args) {
        let task = new Task({
          title: args.title,
          weight: args.weight,
          description: args.description,
          projectId: args.projectId
        });
        return task.save();
      }
    },
    addProject: {
      type: ProjectType,
      args: {
        title: { type: GraphQLString },
        weight: { type: GraphQLInt },
        description: { type: GraphQLString }
      },
      resolve(parent, args) {
        let project = new Project({
          title: args.title,
          weight: args.weight,
          description: args.description
        });
        return project.save();
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});