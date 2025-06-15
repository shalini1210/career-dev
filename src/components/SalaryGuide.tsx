
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp, Lightbulb, MapPin, Briefcase, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';

interface SalaryData {
  position: string;
  country: string;
  customPosition?: string;
}

const SalaryGuide = () => {
  const [salaryResult, setSalaryResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SalaryData>({
    defaultValues: {
      position: '',
      country: '',
      customPosition: ''
    }
  });

  const positions = [
    'Software Engineer',
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'Data Scientist',
    'Product Manager',
    'UX/UI Designer',
    'DevOps Engineer',
    'Marketing Manager',
    'Sales Manager',
    'Business Analyst',
    'Project Manager',
    'Custom Position'
  ];

  const countries = [
    'United States',
    'Canada',
    'United Kingdom',
    'Germany',
    'France',
    'Australia',
    'Netherlands',
    'Sweden',
    'Switzerland',
    'Singapore',
    'India',
    'Brazil'
  ];

  const getSalaryData = (position: string, country: string) => {
    // Mock salary data - in a real app, this would come from an API
    const salaryRanges = {
      'Software Engineer': {
        'United States': { min: 85000, max: 160000, avg: 120000 },
        'Canada': { min: 65000, max: 120000, avg: 90000 },
        'United Kingdom': { min: 45000, max: 90000, avg: 65000 },
        'Germany': { min: 50000, max: 95000, avg: 70000 },
        'Australia': { min: 70000, max: 130000, avg: 95000 }
      },
      'Product Manager': {
        'United States': { min: 100000, max: 180000, avg: 140000 },
        'Canada': { min: 80000, max: 140000, avg: 110000 },
        'United Kingdom': { min: 55000, max: 110000, avg: 80000 }
      },
      'Data Scientist': {
        'United States': { min: 95000, max: 170000, avg: 130000 },
        'Canada': { min: 75000, max: 130000, avg: 100000 },
        'United Kingdom': { min: 50000, max: 100000, avg: 75000 }
      }
    };

    const defaultRange = { min: 50000, max: 120000, avg: 85000 };
    return salaryRanges[position as keyof typeof salaryRanges]?.[country as keyof any] || defaultRange;
  };

  const getNegotiationTips = (position: string, salaryRange: any) => [
    `Research shows ${position} roles in this market typically range from $${salaryRange.min.toLocaleString()} to $${salaryRange.max.toLocaleString()}`,
    'Highlight your unique skills and achievements during negotiations',
    'Consider the total compensation package including benefits, stock options, and PTO',
    'Practice your negotiation conversation beforehand',
    'Be prepared to justify your salary expectations with concrete examples',
    'Know your walk-away point before entering negotiations'
  ];

  const onSubmit = async (data: SalaryData) => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const finalPosition = data.position === 'Custom Position' ? data.customPosition : data.position;
    const salaryRange = getSalaryData(finalPosition!, data.country);
    const tips = getNegotiationTips(finalPosition!, salaryRange);
    
    setSalaryResult({
      position: finalPosition,
      country: data.country,
      salaryRange,
      tips
    });
    
    setIsLoading(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <motion.div variants={itemVariants} className="text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Salary Guide & Negotiation Tips
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Get personalized salary insights and expert negotiation strategies for your role and location
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8">
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-white to-blue-50 border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Target className="mr-3 h-8 w-8 text-blue-600" />
                Salary Calculator
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          <Briefcase className="mr-2 h-4 w-4" />
                          Job Position
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-white">
                              <SelectValue placeholder="Select your position" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {positions.map((position) => (
                              <SelectItem key={position} value={position}>
                                {position}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {form.watch('position') === 'Custom Position' && (
                    <FormField
                      control={form.control}
                      name="customPosition"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Custom Position Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your position title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          <MapPin className="mr-2 h-4 w-4" />
                          Country/Location
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-white">
                              <SelectValue placeholder="Select your country" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {countries.map((country) => (
                              <SelectItem key={country} value={country}>
                                {country}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="mr-2"
                      >
                        <TrendingUp className="h-4 w-4" />
                      </motion.div>
                    ) : (
                      <DollarSign className="mr-2 h-4 w-4" />
                    )}
                    {isLoading ? 'Calculating...' : 'Get Salary Insights'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>

        {salaryResult && (
          <motion.div
            variants={itemVariants}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-gradient-to-br from-white to-green-50 border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <TrendingUp className="mr-3 h-8 w-8 text-green-600" />
                  Salary Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">{salaryResult.position}</h3>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {salaryResult.country}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <motion.div 
                      className="text-center p-4 bg-gradient-to-r from-red-100 to-red-200 rounded-lg"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="text-2xl font-bold text-red-800">
                        ${salaryResult.salaryRange.min.toLocaleString()}
                      </div>
                      <div className="text-sm text-red-600">Minimum</div>
                    </motion.div>
                    <motion.div 
                      className="text-center p-4 bg-gradient-to-r from-green-100 to-green-200 rounded-lg"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="text-2xl font-bold text-green-800">
                        ${salaryResult.salaryRange.avg.toLocaleString()}
                      </div>
                      <div className="text-sm text-green-600">Average</div>
                    </motion.div>
                    <motion.div 
                      className="text-center p-4 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="text-2xl font-bold text-blue-800">
                        ${salaryResult.salaryRange.max.toLocaleString()}
                      </div>
                      <div className="text-sm text-blue-600">Maximum</div>
                    </motion.div>
                  </div>
                </div>

                <div>
                  <h4 className="flex items-center text-lg font-semibold mb-4">
                    <Lightbulb className="mr-2 h-5 w-5 text-yellow-600" />
                    Negotiation Tips
                  </h4>
                  <div className="space-y-3">
                    {salaryResult.tips.map((tip: string, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start space-x-3 p-3 bg-white rounded-lg shadow-sm"
                      >
                        <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {index + 1}
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed">{tip}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default SalaryGuide;
