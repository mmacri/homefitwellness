
import React, { useState, useEffect } from 'react';
import { 
  getCategoryContent, 
  createCategoryContent, 
  updateCategoryContent,
  deleteCategoryContent
} from '@/services/categoryContentService';
import { getNavigationCategories } from '@/services/categoryService';
import { CategoryContent, CategoryContentSection, CategoryContentRecommendation, CategoryContentFAQ } from '@/services/categoryContentService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Save, Trash2, Plus, Copy, FileText, Edit, Eye } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const AdminCategoryContent = () => {
  const [content, setContent] = useState<CategoryContent[]>([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formContent, setFormContent] = useState<Partial<CategoryContent>>({
    meta: {
      title: '',
      description: '',
      canonical: ''
    },
    slug: '',
    headline: '',
    introduction: '',
    sections: [],
    recommendations: [],
    faqs: []
  });
  const { toast } = useToast();

  // Load content and categories on component mount
  useEffect(() => {
    loadCategories();
    loadAllContent();
  }, []);

  // Load categories for dropdowns
  const loadCategories = async () => {
    try {
      const data = await getNavigationCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
      toast({
        title: 'Error',
        description: 'Failed to load categories',
        variant: 'destructive'
      });
    }
  };

  // Load all content from the service
  const loadAllContent = async () => {
    setIsLoading(true);
    try {
      const allContent = await getCategoryContent();
      setContent(allContent);
    } catch (error) {
      console.error('Error loading content:', error);
      toast({
        title: 'Error',
        description: 'Failed to load category content',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Get category name by ID
  const getCategoryNameById = (id: number) => {
    const category = categories.find(cat => cat.id === id);
    return category ? category.name : 'Unknown Category';
  };

  // Create empty content for a category
  const createEmptyContent = (categoryId: number) => {
    const category = categories.find(cat => cat.id === categoryId);
    if (!category) return;

    setFormContent({
      meta: {
        title: `${category.name} - Recovery Essentials Guide`,
        description: `Everything you need to know about ${category.name.toLowerCase()} for recovery and performance.`
      },
      slug: category.slug,
      headline: `${category.name} Guide: Everything You Need To Know`,
      introduction: `Welcome to our comprehensive guide on ${category.name.toLowerCase()}. In this article, we'll cover everything you need to know about choosing and using ${category.name.toLowerCase()} for recovery and performance enhancement.`,
      sections: [
        {
          title: 'What to Look For',
          content: `When shopping for ${category.name.toLowerCase()}, consider these important factors...`
        }
      ],
      recommendations: [],
      faqs: [
        {
          question: `What are the benefits of using ${category.name.toLowerCase()}?`,
          answer: 'Benefits include...'
        }
      ]
    });
    setSelectedCategoryId(categoryId);
    setIsEditing(true);
  };

  // Edit existing content
  const editContent = (contentItem: CategoryContent) => {
    setFormContent({
      ...contentItem,
      meta: {
        ...contentItem.meta
      }
    });
    setSelectedCategoryId(contentItem.categoryId);
    setIsEditing(true);
  };

  // Add a new section to the form
  const addSection = () => {
    setFormContent(prev => ({
      ...prev,
      sections: [
        ...(prev.sections || []),
        {
          title: '',
          content: ''
        }
      ]
    }));
  };

  // Add a new recommendation to the form
  const addRecommendation = () => {
    setFormContent(prev => ({
      ...prev,
      recommendations: [
        ...(prev.recommendations || []),
        {
          title: '',
          description: '',
          imageUrl: '',
          buttonText: 'View Product',
          buttonUrl: ''
        }
      ]
    }));
  };

  // Add a new FAQ to the form
  const addFaq = () => {
    setFormContent(prev => ({
      ...prev,
      faqs: [
        ...(prev.faqs || []),
        {
          question: '',
          answer: ''
        }
      ]
    }));
  };

  // Handle section input changes
  const handleSectionChange = (index: number, field: string, value: string) => {
    setFormContent(prev => {
      const updatedSections = [...(prev.sections || [])];
      updatedSections[index] = {
        ...updatedSections[index],
        [field]: value
      };
      return {
        ...prev,
        sections: updatedSections
      };
    });
  };

  // Handle recommendation input changes
  const handleRecommendationChange = (index: number, field: string, value: string) => {
    setFormContent(prev => {
      const updatedRecommendations = [...(prev.recommendations || [])];
      updatedRecommendations[index] = {
        ...updatedRecommendations[index],
        [field]: value
      };
      return {
        ...prev,
        recommendations: updatedRecommendations
      };
    });
  };

  // Handle FAQ input changes
  const handleFaqChange = (index: number, field: string, value: string) => {
    setFormContent(prev => {
      const updatedFaqs = [...(prev.faqs || [])];
      updatedFaqs[index] = {
        ...updatedFaqs[index],
        [field]: value
      };
      return {
        ...prev,
        faqs: updatedFaqs
      };
    });
  };

  // Remove a section from the form
  const removeSection = (index: number) => {
    setFormContent(prev => {
      const updatedSections = [...(prev.sections || [])];
      updatedSections.splice(index, 1);
      return {
        ...prev,
        sections: updatedSections
      };
    });
  };

  // Remove a recommendation from the form
  const removeRecommendation = (index: number) => {
    setFormContent(prev => {
      const updatedRecommendations = [...(prev.recommendations || [])];
      updatedRecommendations.splice(index, 1);
      return {
        ...prev,
        recommendations: updatedRecommendations
      };
    });
  };

  // Remove a FAQ from the form
  const removeFaq = (index: number) => {
    setFormContent(prev => {
      const updatedFaqs = [...(prev.faqs || [])];
      updatedFaqs.splice(index, 1);
      return {
        ...prev,
        faqs: updatedFaqs
      };
    });
  };

  // Handle meta data changes
  const handleMetaChange = (field: string, value: string) => {
    setFormContent(prev => ({
      ...prev,
      meta: {
        ...prev.meta,
        [field]: value
      }
    }));
  };

  // Handle basic field changes
  const handleFieldChange = (field: string, value: string) => {
    setFormContent(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Save content (create or update)
  const saveContent = async () => {
    try {
      if (!selectedCategoryId) {
        toast({
          title: 'Error',
          description: 'Please select a category',
          variant: 'destructive'
        });
        return;
      }

      const formattedContent = {
        ...formContent,
        categoryId: selectedCategoryId,
        lastUpdated: new Date().toISOString()
      };

      if (formContent.id) {
        // Update existing content
        await updateCategoryContent(formContent.id, formattedContent);
        toast({
          title: 'Success',
          description: 'Content updated successfully'
        });
      } else {
        // Create new content
        await createCategoryContent(formattedContent);
        toast({
          title: 'Success',
          description: 'Content created successfully'
        });
      }

      loadAllContent();
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving content:', error);
      toast({
        title: 'Error',
        description: 'Failed to save content',
        variant: 'destructive'
      });
    }
  };

  // Delete content
  const handleDeleteContent = async (contentId: string) => {
    if (!window.confirm('Are you sure you want to delete this content? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteCategoryContent(contentId);
      toast({
        title: 'Success',
        description: 'Content deleted successfully'
      });
      loadAllContent();
    } catch (error) {
      console.error('Error deleting content:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete content',
        variant: 'destructive'
      });
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (e) {
      return 'Invalid date';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Category Content</h2>
        {!isEditing && (
          <div className="flex gap-2">
            <Select onValueChange={(value) => setSelectedCategoryId(Number(value))}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={() => selectedCategoryId && createEmptyContent(selectedCategoryId)}>
              <PlusCircle className="mr-2 h-4 w-4" /> Create Content
            </Button>
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {formContent.id ? 'Edit Content' : 'Create Content'} for {getCategoryNameById(selectedCategoryId)}
              </CardTitle>
              <CardDescription>
                Create rich content for your category pages to improve SEO and user experience.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs defaultValue="basic">
                <TabsList className="grid grid-cols-5 w-full">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="sections">Sections</TabsTrigger>
                  <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                  <TabsTrigger value="faqs">FAQs</TabsTrigger>
                  <TabsTrigger value="meta">SEO & Meta</TabsTrigger>
                </TabsList>

                {/* Basic Info */}
                <TabsContent value="basic" className="space-y-4 pt-4">
                  <div className="grid gap-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      id="slug"
                      value={formContent.slug || ''}
                      onChange={(e) => handleFieldChange('slug', e.target.value)}
                      placeholder="category-slug"
                    />
                    <p className="text-xs text-gray-500">Should match the category slug for best results.</p>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="headline">Headline</Label>
                    <Input
                      id="headline"
                      value={formContent.headline || ''}
                      onChange={(e) => handleFieldChange('headline', e.target.value)}
                      placeholder="Main headline for the category page"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="introduction">Introduction</Label>
                    <Textarea
                      id="introduction"
                      value={formContent.introduction || ''}
                      onChange={(e) => handleFieldChange('introduction', e.target.value)}
                      placeholder="Introduction paragraph(s)"
                      className="min-h-[150px]"
                    />
                  </div>
                </TabsContent>

                {/* Sections */}
                <TabsContent value="sections" className="space-y-4 pt-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Content Sections</h3>
                    <Button onClick={addSection} variant="outline" size="sm">
                      <Plus className="mr-1 h-4 w-4" /> Add Section
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {formContent.sections?.length ? (
                      formContent.sections.map((section, index) => (
                        <Card key={index}>
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-center">
                              <CardTitle className="text-md">Section {index + 1}</CardTitle>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeSection(index)}
                                className="h-8 w-8 text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="grid gap-2">
                              <Label htmlFor={`section-title-${index}`}>Title</Label>
                              <Input
                                id={`section-title-${index}`}
                                value={section.title}
                                onChange={(e) => handleSectionChange(index, 'title', e.target.value)}
                                placeholder="Section Title"
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor={`section-content-${index}`}>Content</Label>
                              <Textarea
                                id={`section-content-${index}`}
                                value={section.content}
                                onChange={(e) => handleSectionChange(index, 'content', e.target.value)}
                                placeholder="Section content goes here..."
                                className="min-h-[150px]"
                              />
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-8 border-2 border-dashed rounded-lg border-gray-200">
                        <p className="text-gray-500">No sections added yet</p>
                        <Button onClick={addSection} variant="ghost" size="sm" className="mt-2">
                          <Plus className="mr-1 h-4 w-4" /> Add Your First Section
                        </Button>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* Recommendations */}
                <TabsContent value="recommendations" className="space-y-4 pt-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Product Recommendations</h3>
                    <Button onClick={addRecommendation} variant="outline" size="sm">
                      <Plus className="mr-1 h-4 w-4" /> Add Recommendation
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {formContent.recommendations?.length ? (
                      formContent.recommendations.map((rec, index) => (
                        <Card key={index}>
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-center">
                              <CardTitle className="text-md">Recommendation {index + 1}</CardTitle>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeRecommendation(index)}
                                className="h-8 w-8 text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="grid gap-2">
                              <Label htmlFor={`rec-title-${index}`}>Title</Label>
                              <Input
                                id={`rec-title-${index}`}
                                value={rec.title}
                                onChange={(e) => handleRecommendationChange(index, 'title', e.target.value)}
                                placeholder="Recommendation Title"
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor={`rec-desc-${index}`}>Description</Label>
                              <Textarea
                                id={`rec-desc-${index}`}
                                value={rec.description}
                                onChange={(e) => handleRecommendationChange(index, 'description', e.target.value)}
                                placeholder="Brief description..."
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor={`rec-img-${index}`}>Image URL</Label>
                              <Input
                                id={`rec-img-${index}`}
                                value={rec.imageUrl}
                                onChange={(e) => handleRecommendationChange(index, 'imageUrl', e.target.value)}
                                placeholder="https://example.com/image.jpg"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="grid gap-2">
                                <Label htmlFor={`rec-btn-text-${index}`}>Button Text</Label>
                                <Input
                                  id={`rec-btn-text-${index}`}
                                  value={rec.buttonText}
                                  onChange={(e) => handleRecommendationChange(index, 'buttonText', e.target.value)}
                                  placeholder="View on Amazon"
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor={`rec-btn-url-${index}`}>Button URL</Label>
                                <Input
                                  id={`rec-btn-url-${index}`}
                                  value={rec.buttonUrl}
                                  onChange={(e) => handleRecommendationChange(index, 'buttonUrl', e.target.value)}
                                  placeholder="https://amazon.com/..."
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-8 border-2 border-dashed rounded-lg border-gray-200">
                        <p className="text-gray-500">No recommendations added yet</p>
                        <Button onClick={addRecommendation} variant="ghost" size="sm" className="mt-2">
                          <Plus className="mr-1 h-4 w-4" /> Add Your First Recommendation
                        </Button>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* FAQs */}
                <TabsContent value="faqs" className="space-y-4 pt-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Frequently Asked Questions</h3>
                    <Button onClick={addFaq} variant="outline" size="sm">
                      <Plus className="mr-1 h-4 w-4" /> Add FAQ
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {formContent.faqs?.length ? (
                      formContent.faqs.map((faq, index) => (
                        <Card key={index}>
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-center">
                              <CardTitle className="text-md">FAQ {index + 1}</CardTitle>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeFaq(index)}
                                className="h-8 w-8 text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="grid gap-2">
                              <Label htmlFor={`faq-question-${index}`}>Question</Label>
                              <Input
                                id={`faq-question-${index}`}
                                value={faq.question}
                                onChange={(e) => handleFaqChange(index, 'question', e.target.value)}
                                placeholder="What is...?"
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor={`faq-answer-${index}`}>Answer</Label>
                              <Textarea
                                id={`faq-answer-${index}`}
                                value={faq.answer}
                                onChange={(e) => handleFaqChange(index, 'answer', e.target.value)}
                                placeholder="The answer is..."
                                className="min-h-[100px]"
                              />
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-8 border-2 border-dashed rounded-lg border-gray-200">
                        <p className="text-gray-500">No FAQs added yet</p>
                        <Button onClick={addFaq} variant="ghost" size="sm" className="mt-2">
                          <Plus className="mr-1 h-4 w-4" /> Add Your First FAQ
                        </Button>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* SEO & Meta */}
                <TabsContent value="meta" className="space-y-4 pt-4">
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="meta-title">Meta Title</Label>
                      <Input
                        id="meta-title"
                        value={formContent.meta?.title || ''}
                        onChange={(e) => handleMetaChange('title', e.target.value)}
                        placeholder="SEO Title for this category page"
                      />
                      <p className="text-xs text-gray-500">
                        Recommended length: 50-60 characters
                      </p>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="meta-description">Meta Description</Label>
                      <Textarea
                        id="meta-description"
                        value={formContent.meta?.description || ''}
                        onChange={(e) => handleMetaChange('description', e.target.value)}
                        placeholder="Brief description for search engines"
                        className="min-h-[100px]"
                      />
                      <p className="text-xs text-gray-500">
                        Recommended length: 150-160 characters
                      </p>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="meta-canonical">Canonical URL</Label>
                      <Input
                        id="meta-canonical"
                        value={formContent.meta?.canonical || ''}
                        onChange={(e) => handleMetaChange('canonical', e.target.value)}
                        placeholder="https://recovery-essentials.com/categories/..."
                      />
                      <p className="text-xs text-gray-500">
                        Optional. Use this if this content should be canonicalized to another URL.
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={saveContent}>
                <Save className="mr-2 h-4 w-4" /> Save Content
              </Button>
            </CardFooter>
          </Card>
        </div>
      ) : isLoading ? (
        <div className="text-center py-10">Loading content...</div>
      ) : content.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="mb-4">No content found. Create your first category content to get started.</p>
            {selectedCategoryId ? (
              <Button onClick={() => createEmptyContent(selectedCategoryId)}>
                <PlusCircle className="mr-2 h-4 w-4" /> Create Content
              </Button>
            ) : (
              <p className="text-sm text-gray-500">Select a category first</p>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {content.map((item) => (
            <Card key={item.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl truncate" title={item.headline}>
                    {item.headline}
                  </CardTitle>
                  <div className="flex space-x-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => editContent(item)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDeleteContent(item.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
                <CardDescription className="mt-2 line-clamp-2">
                  {getCategoryNameById(item.categoryId)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm flex gap-2">
                    <FileText className="h-4 w-4" />
                    <span>{item.sections?.length || 0} sections</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Last Updated:</span>{' '}
                    {item.lastUpdated ? formatDate(item.lastUpdated) : 'Never'}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  asChild
                >
                  <a href={`/categories/${item.slug}`} target="_blank" rel="noopener noreferrer">
                    View Page <Eye className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminCategoryContent;
